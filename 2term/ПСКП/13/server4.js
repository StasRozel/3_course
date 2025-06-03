const net = require('net');

function handleConnection(socket, port) {
  console.log(`Новое соединение на порт ${port}`);

  socket.on('data', (data) => {
    const number = data.readInt32BE(); 
    console.log(`Получено число ${number} от клиента на порт ${port}`);
    const response = `ECHO: ${number}`;
    socket.write(response); 
  });

  socket.on('end', () => {
    console.log(`Клиент отключился от порта ${port}`);
  });
}

const server1 = net.createServer((socket) => handleConnection(socket, 40000));
server1.listen(40000, () => {
  console.log('Сервер прослушивает порт 40000');
});

const server2 = net.createServer((socket) => handleConnection(socket, 50000));
server2.listen(50000, () => {
  console.log('Сервер прослушивает порт 50000');
});
