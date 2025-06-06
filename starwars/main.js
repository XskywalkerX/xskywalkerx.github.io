// /pascal-wars/main.js

let socket;
let playerRole;
let currentRoom;

function createRoom() {
  currentRoom = generateRoomCode();
  connectToServer();
  playerRole = 'host';
}

function joinRoom() {
  currentRoom = document.getElementById('roomCode').value;
  connectToServer();
  playerRole = 'guest';
}

function connectToServer() {
  // NOTE: replace URL when backend is ready
  socket = new WebSocket("wss://your-ws-server-url");

  socket.onopen = () => {
    socket.send(JSON.stringify({
      type: playerRole === 'host' ? 'create' : 'join',
      room: currentRoom
    }));
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('game').style.display = 'block';
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'start') {
      document.getElementById('status').innerText = 'Game started!';
    } else if (data.type === 'fire') {
      drawHit(data.x, data.y);
    }
  };
}

function fire() {
  const n = parseInt(document.getElementById('n').value);
  const k = parseInt(document.getElementById('k').value);
  const result = binomialCoefficient(n, k);

  const x = n % 10;
  const y = k % 10;

  drawFire(x, y);
  socket.send(JSON.stringify({ type: 'fire', room: currentRoom, x, y }));
}

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function binomialCoefficient(n, k) {
  if (k < 0 || k > n) return 0;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = res * (n - i + 1) / i;
  }
  return Math.floor(res);
}

function drawFire(x, y) {
  const ctx = document.getElementById("gameCanvas").getContext("2d");
  ctx.fillStyle = "cyan";
  ctx.fillRect(x * 50, y * 50, 40, 40);
}

function drawHit(x, y) {
  const ctx = document.getElementById("gameCanvas").getContext("2d");
  ctx.fillStyle = "red";
  ctx.fillRect(x * 50 + 5, y * 50 + 5, 30, 30);
}
