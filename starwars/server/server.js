// server.js (Node.js WebSocket server)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

const rooms = {};

wss.on('connection', ws => {
  ws.on('message', msg => {
    const data = JSON.parse(msg);

    if (data.type === 'create') {
      rooms[data.room] = [ws];
    } else if (data.type === 'join') {
      if (rooms[data.room]) {
        rooms[data.room].push(ws);
        rooms[data.room].forEach(s => s.send(JSON.stringify({ type: 'start' })));
      }
    } else if (data.type === 'fire') {
      if (rooms[data.room]) {
        rooms[data.room].forEach(s => {
          if (s !== ws) {
            s.send(JSON.stringify({ type: 'fire', x: data.x, y: data.y }));
          }
        });
      }
    }
  });
});
