🎤 Live Lyrics

A real-time, network-synced lyrics display system for live performance.

Control your setlist and lyrics from your main machine (e.g. running Apple MainStage) and automatically sync lyrics to any device on your network (like an iPad).

🚀 Features
🎹 MIDI Program Change song switching
📡 Real-time sync to multiple devices (WebSocket)
📱 iPad-friendly display (auto responsive)
📄 ChordPro support (chords + lyrics formatting)
🎯 Setlist-based navigation
⏭ Previous / Next song controls
🔁 Slave devices auto-update instantly
🧠 Lightweight + offline (no internet required)
🧱 How It Works
Your main machine runs the Node server
MIDI (from MainStage or other controller) selects songs
Lyrics are broadcast over your local network
Any device (iPad, laptop, etc.) connects via browser and follows along
📁 Project Structure
live-lyrics/
├── server.js           # Node backend (MIDI + WebSocket + API)
├── main.js             # Electron launcher (optional)
├── package.json
├── songs/              # ChordPro .txt files
├── songlist.json       # Maps MIDI program → song file
└── client/
    └── build/          # React frontend (production build)
⚙️ Installation
1. Install dependencies
npm install
2. Build the frontend
cd client
npm install
npm run build
cd ..
3. Start the server
node server.js
4. Open in browser

On your main machine:

http://localhost:3001

On your iPad or other device:

http://YOUR-IP-ADDRESS:3001

Example:

http://192.168.0.179:3001
🎹 MIDI Setup (MainStage)
Open Apple MainStage
Add an External Instrument or MIDI output
Send Program Change messages
Match program numbers to songlist.json
📝 Song Format (ChordPro)

Example:

{title: Cars}
{artist: Gary Numan}

[Verse 1]
Here in my [Am]car, I feel [F]safest of [C]all

[Chorus]
I can [G]lock all my doors
Supported tags:
{title: } → displayed in header (bold)
{artist: } → displayed next to title
[Verse], [Chorus], etc.
Chords inline with lyrics
🎛 songlist.json Format
[
  { "program": 44, "file": "Cars.txt" },
  { "program": 45, "file": "DanceHallDays.txt" }
]
program = MIDI Program Change number
file = filename inside /songs
🖥 Controls
From UI:
Click song → loads lyrics
Header:
⬅ Previous song
➡ Next song
Title click → returns to song list
From MIDI:
Program Change selects song instantly
📱 Display Behavior
Landscape → 2-column layout
Portrait → 1-column layout
Auto-scroll (if enabled per song)
Sections only render when content exists
🔄 Real-Time Sync
Uses WebSockets (ws)
All connected devices update instantly
Slave screens always match master
📦 Optional: Run as Desktop App (Electron)
Start app:
npm start
Build Mac app:
npm run dist

Creates:

/dist/Live Lyrics.dmg
⚠️ Requirements
Node.js v20 LTS recommended
macOS (for MIDI + Electron build)
IAC Driver enabled (for virtual MIDI routing)
🛠 Troubleshooting
App not loading
Ensure server is running
Check http://localhost:3001
iPad not connecting
Verify same WiFi network
Use correct IP (not localhost)
MIDI not working
Confirm IAC Bus is enabled
Match program numbers in songlist.json
Blank screen in Electron
Server not starting → check terminal logs
Add startup delay in main.js
🎤 Live Performance Tips
Run everything locally (no internet dependency)
Preload your setlist before the show
Use wired or stable WiFi network
Keep backup device ready (second iPad)
🔮 Future Ideas
Setlist editor UI
Per-song tempo + auto-scroll sync
MIDI CC for scroll control
Dark mode / high contrast mode
🤘 Credits

Built for live musicians who want tight, reliable lyric control on stage.
