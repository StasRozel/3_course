const WebSocket = require('ws');

let clients = [];

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  clients.push(ws);
  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});

function notifyClients(message) {
  clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
}

module.exports = { wss, notifyClients };
