const WebSocket = require('ws');

const SERVER_URL = 'ws://localhost:4000';
const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
  console.log('Подключено к серверу');
});

ws.on('message', (message) => {
  console.log('Сообщение от сервера:', message.toString());
});

ws.on('ping', () => {
  ws.pong();
});

ws.on('close', () => {
  console.log('Соединение с сервером закрыто');
});
