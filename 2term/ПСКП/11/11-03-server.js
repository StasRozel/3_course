const WebSocket = require('ws');

const PORT = 4000;
const wss = new WebSocket.Server({ port: PORT });

let messageCounter = 0;

setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.isAlive === false) {
      console.log('Отключение неактивного клиента');
      return client.terminate();
    }
    client.isAlive = false;
    client.ping();
  });

  console.log(`Активных соединений: ${wss.clients.size}`);
}, 5000);

setInterval(() => {
  messageCounter++;
  const message = `11-03-server: ${messageCounter}`;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}, 15000);

wss.on('connection', (ws) => {
  console.log('Клиент подключился');
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('close', () => {
    console.log('Клиент отключился');
  });
});

console.log(`WS-сервер запущен на порту ${PORT}`);
