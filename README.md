<!-- yes this readme is ai sorry -->

# 🩺 Replit WakaTime Heartbeat Extension

This project tracks coding activity inside a Replit environment and periodically sends **heartbeats** (activity data) to a remote analytics server (e.g., [WakaTime](https://wakatime.com/) or a compatible endpoint).
It monitors file edits, detects line additions/deletions, and sends summarized usage stats automatically every 30 seconds.

---

## 🚀 Features

- 🔍 Watches all files in your Replit workspace for changes
- 🧠 Calculates line additions and deletions between saves
- 📤 Sends periodic activity "heartbeats" to your analytics API
- 🪶 Uses Replit’s Extension SDK (`@replit/extensions-react`)
- 🧰 Stores configuration (API URL + API Key) securely in Replit DB
- 💻 Runs invisibly inside the Replit UI

---

## 📦 Installation & Setup

### 1️⃣ Clone or Import the Project

If using Replit:

1. open the extentions tab
2. search "Hackatime"
3. install hackatime
4. setup api key and url in config
5. start coding!

If running locally:

```bash
git clone https://github.com/NeonGamerBot-QK/replit-hackatime-extension.git
cd replit-hackatime-extension
```

---

### 2️⃣ Install Dependencies

Use **npm** or **yarn**:

```bash
npm install @replit/extensions-react react react-dom
# or
yarn add @replit/extensions-react react react-dom
```

---

### 3️⃣ Add Replit DB Configuration

In your Replit environment, run the following in the console to set your tracking server and API key:

```bash
await replit.replDb.set({ key: "hackatimeUrl", value: "https://api.wakatime.com/api/v1" });
await replit.replDb.set({ key: "hackatimeKey", value: "YOUR_API_KEY_HERE" });
```

If you’re testing a local API, use:

```bash
await replit.replDb.set({ key: "hackatimeUrl", value: "http://localhost:3000" });
await replit.replDb.set({ key: "hackatimeKey", value: "test-key" });
```

---

### 4️⃣ Run the Extension

To start your extension:

```bash
npm run start
```

or (if using TypeScript)

```bash
npm run dev
```

This will render a hidden React component that runs in the background.
You’ll see logs in the Replit console whenever a heartbeat is sent.

---

## 🧠 How It Works

1. **Directory Watcher:**
   Uses `replit.fs.watchDir()` to monitor the workspace for file changes.

2. **Diff Calculation:**
   When a file changes, it compares old and new content to count line additions and deletions.

3. **Heartbeat Creation:**
   Builds a JSON object containing metadata:

   - File name
   - Language
   - Lines edited
   - Timestamp
   - Project name
   - Machine ID

4. **Batch Send:**
   Every 30 seconds, unsent heartbeats are posted to `hackatimeUrl/users/current/heartbeats.bulk` with the key stored in Replit DB.

---

## 🧩 File Structure

```
src/
├── index.tsx         # Main React component
├── generateHeartbeat.ts # Heartbeat logic
├── sendHeartbeat.ts     # API call
├── types.d.ts          # (optional) TypeScript definitions
public/
└── index.html
```

---

## 🛠️ TypeScript Notes

If you’re using **TypeScript**, rename your main file to `index.tsx` and ensure `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "module": "ESNext",
    "target": "ES2017",
    "moduleResolution": "Node",
    "skipLibCheck": true,
    "strict": false
  },
  "include": ["src/**/*"]
}
```

To run it:

```bash
npx tsc --noEmit && npm start
```

You can also use a dev server like **Vite**:

```bash
npm create vite@latest
# choose React + TypeScript template
```

Then copy your component into `src/App.tsx`.

---

## 🧾 Example Heartbeat JSON

```json
{
  "lines": 120,
  "cursorpos": 450,
  "machine_name_id": "9482012735",
  "time": 1728570123,
  "category": "coding",
  "entity": "src/index.tsx",
  "language": "tsx",
  "type": "coding",
  "line_deletions": 3,
  "line_additions": 7,
  "editor": "Replit",
  "project": "MyProject",
  "is_write": false,
  "operating_system": "linux"
}
```

---

## 🧩 Example Console Output

```
Active file: src/index.tsx
Heartbeat sent! [{"lines":120,"line_additions":7,"line_deletions":3,"project":"MyProject"}]
```

---

## ⚠️ Troubleshooting

| Issue                            | Solution                                                                               |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| `Permission denied` on Replit DB | Make sure you’re logged in and running in a Replit extension context                   |
| `Heartbeat failed!`              | Check that your API URL and key are set correctly in Replit DB                         |
| `replit.fs.watchDir` not firing  | Replit may restrict file watchers; try using smaller subdirectories or manual triggers |

---

## 🧑‍💻 Author

**Neon**
Built for the Replit + WakaTime integration concept.
