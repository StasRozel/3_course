const net = require('net');
const process = require('process');

const port = parseInt(process.argv[2], 10);
if (isNaN(port)) {
  console.error('Пожалуйста, укажите корректный номер порта.');
  process.exit(1);
}

const client = new net.Socket();
client.connect(port, '127.0.0.1', () => {
  console.log(`Подключение установлено к серверу на порт ${port}`);
});

let X = 10;
const intervalId = setInterval(() => {
  const buffer = Buffer.alloc(4);
  buffer.writeInt32BE(X);
  client.write(buffer); 
  console.log(`Отправлено число: ${X}`);
  X++; 
}, 1000);

client.on('data', (data) => {
  console.log(`Получено от сервера: ${data.toString()}`);
});

setTimeout(() => {
  clearInterval(intervalId); 
  client.end();
  console.log('Клиент завершил работу');
}, 20000);
