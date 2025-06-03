const net = require('net');

const client = new net.Socket();
let counter = 0;
const interval = 1000; 
const stopTime = 20000;

client.connect(2000, '127.0.0.1', () => {
  console.log('Подключение к серверу установлено');
});

const intervalId = setInterval(() => {
  const number = counter++;
  const buffer = Buffer.alloc(4);
  buffer.writeInt32BE(number); 

  client.write(buffer); 
  console.log(`Отправлено число: ${number}`);
}, interval);

client.on('data', (data) => {
  const sum = parseInt(data.toString(), 10);
  console.log(`Промежуточная сумма от сервера: ${sum}`);
});

setTimeout(() => {
  clearInterval(intervalId); 
  client.end(); 
  console.log('Клиент завершил работу');
}, stopTime);
