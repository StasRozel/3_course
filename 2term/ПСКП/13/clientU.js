const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const message = Buffer.from('Hello, UDP server!');

const serverAddress = '127.0.0.1';
const serverPort = 2000;


client.send(message, 0, message.length, serverPort, serverAddress, (err) => {
  if (err) {
    console.error(`Ошибка отправки сообщения: ${err}`);
    client.close();
  } else {
    console.log(`Сообщение отправлено на сервер: ${message.toString()}`);
  }
});

client.on('message', (msg) => {
  console.log(`Ответ от сервера: ${msg.toString()}`);
  client.close();
});

client.on('error', (err) => {
  console.error(`Ошибка клиента: ${err}`);
  client.close();
});
