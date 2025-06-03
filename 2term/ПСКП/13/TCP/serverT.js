const net = require('net');

const server = net.createServer((socket) => {
  console.log('Клиент подключился');

  socket.on('data', (data) => {
    console.log(`Получено: ${data.toString()}`);
    const response = `ECHO: ${data.toString()}`;
    socket.write(response);
  });

  socket.on('end', () => {
    console.log('Клиент отключился');
  });
});

server.listen(2000, () => {
  console.log('Сервер запущен на порту 2000');
});
