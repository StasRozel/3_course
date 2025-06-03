const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
  console.log(`Получено сообщение от ${rinfo.address}:${rinfo.port} - ${msg}`);

  const response = `ECHO: ${msg}`;
  server.send(response, rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.error(`Ошибка отправки ответа: ${err}`);
    } else {
      console.log(`Отправлен ответ: ${response}`);
    }
  });
});

server.on('error', (err) => {
  console.error(`Ошибка сервера: ${err.stack}`);
  server.close();
});

server.bind(2000, () => {
  console.log('UDP-сервер запущен на порту 2000');
});
