const WebSocket = require('ws');

const PORT = 4000;
const wss = new WebSocket.Server({ port: PORT });

let messageCounter = 0;

wss.on('connection', (ws) => {
  console.log('Клиент подключился');
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('message', (message) => {
    try {
      messageCounter++;
      const receivedMessage = JSON.parse(message.toString());
      console.log('Получено сообщение от клиента:', receivedMessage);
      const response = {
        server: messageCounter,
        client: receivedMessage.client,
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(response));
    } catch (error) {
      console.error('Ошибка при обработке сообщения:', error);
    }
  });

  ws.on('close', () => {
    console.log('Клиент отключился');
  });
});

console.log(`WS-сервер запущен на порту ${PORT}`);
