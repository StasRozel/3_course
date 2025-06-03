const net = require('net');
const process = require('process');

const X = parseInt(process.argv[2], 10);
if (isNaN(X)) {
  console.error('Пожалуйста, укажите корректное число X.');
  process.exit(1);
}

const client = new net.Socket();
let counter = 0;

client.connect(2000, '127.0.0.1', () => {
  console.log('Подключение к серверу установлено');
});

const intervalId = setInterval(() => {
  const buffer = Buffer.alloc(4);
  buffer.writeInt32BE(X);
  client.write(buffer);
  console.log(`Отправлено число: ${X}`);
}, 1000);

client.on('data', (data) => {
  const sum = parseInt(data.toString(), 10);
  console.log(`Промежуточная сумма от сервера: ${sum}`);
});

setTimeout(() => {
  clearInterval(intervalId);
  client.end();
  console.log('Клиент завершил работу');
}, 20000);
