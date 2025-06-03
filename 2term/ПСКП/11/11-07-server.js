const WebSocket = require('ws');

const PORT = 4000;
const wss = new WebSocket.Server({ port: PORT });

console.log(`WS-сервер запущен на порту ${PORT}`);

wss.on('connection', (ws) => {
  console.log('Клиент подключился');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (['A', 'B', 'C'].includes(data.notification)) {
        console.log(`Получено уведомление: ${data.notification}`);
      } else {
        console.log('Неизвестное уведомление:', data);
      }
    } catch (error) {
      console.error('Ошибка обработки сообщения:', error.message);
    }
  });

  ws.on('close', () => {
    console.log('Клиент отключился');
  });
});
