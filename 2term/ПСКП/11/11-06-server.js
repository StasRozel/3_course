const WebSocket = require('ws');
const readline = require('readline');

const PORT = 4000;
const wss = new WebSocket.Server({ port: PORT });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const events = ['A', 'B', 'C'];

wss.on('connection', (ws) => {
  console.log('Клиент подключился');
  ws.send(JSON.stringify({ message: 'Подключение установлено. Подпишитесь на событие (A, B, C).' }));

  ws.on('message', (message) => {
    console.log(`Получено сообщение от клиента: ${message}`);
  });

  ws.on('close', () => {
    console.log('Клиент отключился');
  });
});

console.log(`WS-сервер запущен на порту ${PORT}`);
console.log('Введите символ (A, B, C) для генерации события.');

rl.on('line', (input) => {
  if (events.includes(input)) {
    console.log(`Событие ${input} сгенерировано.`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ event: input }));
      }
    });
  } else {
    console.log('Некорректный ввод. Используйте A, B или C.');
  }
});
