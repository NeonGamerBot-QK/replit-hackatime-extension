// ==UserScript==
// @name         Replit hackatime
// @namespace    https://hackatime.hackclub.com
// @version      2025-10-25
// @description  Hackatime in replit!
// @author       Neon <neon+hackatime@hackclub.com>
// @match        https://replit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=replit.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const hkey = localStorage.getItem("hkey")
    ? localStorage.getItem("hkey")
    : prompt("Whats your hackatime key?:");
  localStorage.setItem("hkey", hkey);
  //--------------------------------------------------------------------
  // Heartbeat: send a fetch to hackatime.hackclub.com only if 30s have passed
  //--------------------------------------------------------------------
  let lastHeartbeat = 0; // ms since epoch

  async function sendHeartbeatIfNeeded(line, col, filename, project) {
    const now = Date.now();
    const THIRTY_SECONDS = 30_000;
    if (now - lastHeartbeat < THIRTY_SECONDS) {
      // not enough time has passed
      return false;
    }

    // Update immediately to prevent bursts from concurrent calls;
    // only overwrite again on success if you prefer — updating now avoids races.
    lastHeartbeat = now;

    try {
      // Adjust endpoint/method/body as needed for your backend.
      const resp = await fetch(
        `https://hackatime.hackclub.com/api/hackatime/v1/users/current/heartbeats.bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${hkey}`,
          },
          body: JSON.stringify([
            {
              time: Date.now() / 1000,
              entity: "replit",
              type: "coding",
              cursorpos: col,
              lineno: line,
              project: project,
              editor: "replit",
              operating_system: "linux",
              language: filename.split(".").slice(1).join("."),
              branch: "main",
              plugin: "replit/0.0.0 replit-wakatime/v0.0.0",
              user_agent: "replit/0.0.0 replit-wakatime/v0.0.0",
            },
          ]),
          // you can send credentials or headers if required:
          // credentials: 'include',
        }
      );

      if (!resp.ok) {
        console.warn(
          "[heartbeat] non-OK response",
          resp.status,
          resp.statusText
        );
        localStorage.removeItem("hkey");
        return false;
      }

      console.log("[heartbeat] sent at", new Date(now).toISOString());
      return true;
    } catch (err) {
      console.error("[heartbeat] fetch failed:", err);
      return false;
    }
  }

  //--------------------------------------------------------------------
  // Helper: return caret offset inside a contenteditable element
  //--------------------------------------------------------------------
  function getCaretOffset(el) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    if (!el.contains(range.endContainer)) return null; // caret not inside this editor

    const pre = range.cloneRange();
    pre.selectNodeContents(el);
    pre.setEnd(range.endContainer, range.endOffset);
    return pre.toString().length;
  }

  //--------------------------------------------------------------------
  // Helper: convert absolute offset → { line, col }
  //--------------------------------------------------------------------
  function offsetToLineCol(text, offset) {
    const lines = text.substring(0, offset).split("\n");
    const line = lines.length; // 1-based line number
    const col = lines[lines.length - 1].length + 1; // 1-based column
    return { line, col };
  }

  //--------------------------------------------------------------------
  // Attach listeners to every .cm-content element we can find
  //--------------------------------------------------------------------
  function attachWatchers() {
    const editors = document.querySelectorAll(".cm-content");
    for (const el of editors) {
      if (el._hasLineColWatcher) continue;
      el._hasLineColWatcher = true;

      console.log("[cm-content] Watching:", el);

      const logPosition = async () => {
        const offset = getCaretOffset(el);
        if (offset == null) return;
        const text = el.innerText || "";
        const { line, col } = offsetToLineCol(text, offset);
        console.log(
          `%c[cm-content Typing]`,
          "color: cyan;",
          `Line ${line}, Col ${col} file: ${window.location.hash}`
        );

        // send heartbeat if at least 30s have passed since last one
        // This call will return immediately if 30s hasn't passed.
        sendHeartbeatIfNeeded(
          line,
          col,
          window.location.hash,
          window.location.pathname.split("/").slice(2).join("/")
        ).catch((e) => console.error("[heartbeat] unexpected error:", e));
      };

      // Input fires on text changes (typing, paste, delete)
      el.addEventListener("input", logPosition);
      // Keyup lets you log cursor moves (arrows, etc.)
      el.addEventListener("keyup", logPosition);
      // Optional: click updates when user moves caret with mouse
      el.addEventListener("click", logPosition);
    }
  }

  //--------------------------------------------------------------------
  // Keep watching for dynamically inserted editors
  //--------------------------------------------------------------------
  const observer = new MutationObserver(() => attachWatchers());
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial scan
  attachWatchers();
  setTimeout(attachWatchers, 2000);

  console.log("[CodeMirror Line/Column Estimator] Initialized");
})();
