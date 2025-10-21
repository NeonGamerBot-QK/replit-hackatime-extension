import * as React from "react";
import { render } from "react-dom";
import { useReplit } from "@replit/extensions-react";
//https://docs.replit.com/extensions/api/fs
function Component() {
  const { replit } = useReplit();
  // replit.debug.info("Hello world!");
  console.log(replit.session);
  const [hackatimeKey, setHackatimeKey] = React.useState<string | null>(null);
  const [hackatimeUrl, setHackatimeUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    (async () => {
      const dbHackatimeKey = await replit.replDb.get({ key: "hackatimeKey" });
      const dbHackatimeUrl =
        (await replit.replDb.get({ key: "hackatimeUrl" })) ||
        "https://hackatime.hackclub.com/api/hackatime/v1";
      setHackatimeKey(dbHackatimeKey as string);
      setHackatimeUrl(dbHackatimeUrl as string);
      setLoading(false);
    })();
  }, []);
  if (loading) return <p>Loading...</p>;
  return (
    <div style={{ background: "white", color: "black" }}>
      <h1>Config!</h1>
      <div style={{ margin: "10px", border: "1px solid black", padding: 5 }}>
        <div style={{ margin: 5, padding: 5 }}>
          <label>Hackatime key: </label>
          <input
            type="text"
            value={hackatimeKey || ""}
            onChange={(e) => setHackatimeKey(e.target.value)}
          />
        </div>
        <div style={{ margin: 5, padding: 5 }}>
          <label>Hackatime URL: </label>
          <input
            type="url"
            value={
              hackatimeUrl || "https://hackatime.hackclub.com/api/hackatime/v1"
            }
            onChange={(e) => setHackatimeUrl(e.target.value)}
          />
          <div>
            <button
              onClick={() => {
                replit.replDb.set({ key: "hackatimeKey", value: hackatimeKey });
                replit.replDb.set({ key: "hackatimeUrl", value: hackatimeUrl });
                replit.debug.info("Saved!");
                replit.messages.showConfirm("Saved config!");
              }}
              style={{ border: "10px", padding: 15 }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

render(<Component />, document.getElementById("root") as Element);
