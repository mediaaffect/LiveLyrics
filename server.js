const express = require('express');
const WebSocket = require('ws');
const midi = require('midi');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

const SONG_DIR = path.join(__dirname, 'songs');
const MAP_FILE = path.join(__dirname, 'mapping.json');
const SETTINGS_FILE = path.join(__dirname, 'settings.json');

let songMap = {};
let settings = {};
let clients = [];
let currentProgram = null;

// ---------- HELPERS ----------
function loadJSON(file) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : {};
}

function loadSong(filename) {
  const filePath = path.join(SONG_DIR, filename);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : null;
}

function broadcast(data) {
  // clean dead sockets
  clients = clients.filter(ws => ws.readyState === WebSocket.OPEN);

  clients.forEach(ws => {
    ws.send(JSON.stringify(data));
  });
}

// ---------- SONG LOGIC ----------
function sendSong(program) {
  program = parseInt(program);

  const file = songMap[program];
  if (!file) {
    console.log('Song not found:', program);
    return;
  }

  console.log('Loading song:', program, file);

  const content = loadSong(file);
  const config = settings[file] || {};

  currentProgram = program;

  broadcast({
    type: 'song',
    program,
    file,
    content,
    config
  });

  preloadNext(program);
}

function preloadNext(program) {
  const keys = Object.keys(songMap).map(Number).sort((a, b) => a - b);
  const idx = keys.indexOf(program);
  const next = keys[idx + 1];

  if (next !== undefined) {
    const nextFile = songMap[next];
    const content = loadSong(nextFile);

    broadcast({
      type: 'preload',
      program: next,
      file: nextFile,
      content
    });
  }
}

// ---------- LOAD FILES ----------
songMap = loadJSON(MAP_FILE);
settings = loadJSON(SETTINGS_FILE);

// ---------- MIDI ----------
const input = new midi.Input();

console.log('Available MIDI Ports:');
for (let i = 0; i < input.getPortCount(); i++) {
  console.log(`Port ${i}: ${input.getPortName(i)}`);
}

input.openPort(0);

input.on('message', (_, msg) => {
  const [status, d1, d2] = msg;

  if ((status & 0xF0) === 0xC0) {
    const program = d1 + 1;
    console.log('Program Change:', program);
    sendSong(program);
  }

  if ((status & 0xF0) === 0xB0) {
    broadcast({ type: 'scrollSpeed', value: d2 });
  }
});

// ---------- API ----------
app.use(express.json());

app.get('/songs', (req, res) => {
  res.json(songMap);
});

// ✅ supports GET + POST
app.all('/go/:program', (req, res) => {
  sendSong(req.params.program);
  res.json({ ok: true });
});

// ---------- STATIC ----------
app.use(express.static(path.join(__dirname, 'client/build')));

// ---------- REACT FALLBACK ----------
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// ---------- SERVER ----------
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ---------- WEBSOCKET ----------
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('Client connected');

  clients.push(ws);

  // ✅ send CURRENT song ONLY to this client
  if (currentProgram) {
    const file = songMap[currentProgram];
    const content = loadSong(file);
    const config = settings[file] || {};

    ws.send(JSON.stringify({
      type: 'song',
      program: currentProgram,
      file,
      content,
      config
    }));
  }

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
    console.log('Client disconnected');
  });
});


app.listen(3001, () => {
  console.log('Server running');
});