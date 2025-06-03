const WebSocket = require('ws');

const SERVER_URL = 'ws://localhost:4000';

const clientName = process.argv[2];
if (!clientName) {
  console.error('Ошибка: укажите имя клиента в качестве параметра');
  process.exit(1);
}

const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
  console.log(`Подключено к серверу как клиент: ${clientName}`);

  const message = {
    client: clientName,
    timestamp: new Date().toISOString(),
  };

  ws.send(JSON.stringify(message));
  console.log(`Сообщение отправлено серверу: ${JSON.stringify(message)}`);
});

ws.on('message', (message) => {
  console.log('Ответ от сервера:', message.toString());
});

ws.on('close', () => {
  console.log('Соединение с сервером закрыто');
});
