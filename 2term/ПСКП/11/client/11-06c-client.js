const WebSocket = require('ws');

const SERVER_URL = 'ws://localhost:4000';

const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
  console.log('Подключено к серверу. Ожидание события C...');
});

ws.on('message', (message) => {
  const data = JSON.parse(message);
  if (data.event === 'C') {
    console.log('Получено событие C!');
  }
});

ws.on('close', () => {
  console.log('Соединение закрыто');
});
