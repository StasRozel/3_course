const WebSocket = require('ws');
const readline = require('readline');

const SERVER_URL = 'ws://localhost:4000';

const ws = new WebSocket(SERVER_URL);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

ws.on('open', () => {
  console.log('Подключено к серверу. Введите A, B или C для отправки уведомления.');
});

ws.on('close', () => {
  console.log('Соединение с сервером закрыто');
  rl.close();
});

rl.on('line', (input) => {
  if (['A', 'B', 'C'].includes(input)) {
    ws.send(JSON.stringify({ notification: input }));
    console.log(`Уведомление "${input}" отправлено серверу.`);
  } else {
    console.log('Некорректный ввод. Введите A, B или C.');
  }
});
