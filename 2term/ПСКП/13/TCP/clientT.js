const net = require('net');

const client = net.createConnection({ port: 2000 }, () => {
  console.log('Соединение с сервером установлено');

  const message = 'Hello, server!';
  console.log(`Отправлено: ${message}`);
  client.write(message);
});

client.on('data', (data) => {
  console.log(`Ответ от сервера: ${data.toString()}`);
  client.end();
});

client.on('end', () => {
  console.log('Соединение закрыто');
});
