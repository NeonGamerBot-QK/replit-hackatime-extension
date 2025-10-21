import * as React from "react";
import { render } from "react-dom";
import { useReplit } from "@replit/extensions-react";
function sendHeartbeat(base: string, key: string, heartbeats: any) {
  fetch(base + "/users/current/heartbeats.bulk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(key),
      "User-Agent": "replit-wakatime/1.0",
    },
    body: JSON.stringify(heartbeats),
  }).then((d) => {
    if (d.status === 201) {
      console.log(`Heartbeat sent! ${JSON.stringify(heartbeats)}`);
      d.text().then(console.log);
    } else {
      console.log(`Heartbeat failed! ${JSON.stringify(heartbeats)}`);
    }
  });
}
function generateHeartbeat(
  oldFileContent: string,
  newFileContent: string,
  filename: string,
  projectName: string,
) {
  const oldLines = oldFileContent.split("\n");
  const newLines = newFileContent.split("\n");

  let lineAdditions = 0;
  let lineDeletions = 0;
  const maxLines = Math.max(oldLines.length, newLines.length);

  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i] || "";
    const newLine = newLines[i] || "";
    if (oldLine !== newLine) {
      if (!oldLine) lineAdditions++;
      else if (!newLine) lineDeletions++;
      else {
        lineDeletions++;
        lineAdditions++;
      }
    }
  }

  return {
    lines: newLines.length,
    cursorpos: newFileContent.length,
    machine_name_id: Math.random().toFixed(10).toString().split(".")[1],
    time: Math.floor(Date.now() / 1000),
    category: "coding",
    entity: filename,
    language: filename.split(".").pop(),
    type: "coding",
    line_deletions: lineDeletions,
    line_additions: lineAdditions,
    user_agent: "replit-wakatime/1.0",
    editor: "Replit",
    project: projectName,
    project_root_count: 1,
    is_write: false,
    operating_system: "linux",
    lineno: 1,
    branch: "main",
  };
}

function Component() {
  const { replit } = useReplit();

  const fileCache = React.useRef<Map<string, string>>(new Map());
  const latestHeartbeats = React.useRef<any[]>([]);

  React.useEffect(() => {
    const logInterval = setInterval(async () => {
      // api url and key
      const base = await replit.replDb.get({ key: "hackatimeUrl" });
      const key = await replit.replDb.get({ key: "hackatimeKey" });
      if (latestHeartbeats.current.length > 0) {
        replit.debug.info("Sending heartbeat:");
        console.log(base, key);
        replit.debug.log(JSON.stringify(latestHeartbeats.current));
        sendHeartbeat(base, key, latestHeartbeats.current);
        latestHeartbeats.current = [];
      }
    }, 30 * 1000);

    // Watch entire project directory
    replit.fs.watchDir("/home/runner/workspace", {
      onChange: async () => {
        try {
          const activeFile = await replit.session.getActiveFile();
          if (!activeFile) return;
          replit.debug.info("Active file: " + activeFile);

          const currentContent = await replit.fs
            .readFile(activeFile, "utf8")
            //@ts-ignore
            .then((d) => d.content || "mrrp");
          const oldContent = fileCache.current.get(activeFile) || "";
          fileCache.current.set(activeFile, currentContent);

          const projectName = await replit.data
            .currentRepl()
            .then((d) => d.repl.title);
          const heartbeat = generateHeartbeat(
            oldContent,
            currentContent,
            activeFile,
            projectName,
          );

          latestHeartbeats.current.push(heartbeat);
        } catch (err) {
          replit.debug.error("onChange error: " + err.message);
        }
      },
      onError: (err) => {
        replit.debug.error("Watch error: " + err.message);
      },
    });

    return () => clearInterval(logInterval);
  }, [replit]);

  return <div style={{ display: "none" }}>Extension running...</div>;
}

render(<Component />, document.getElementById("root") as Element);
