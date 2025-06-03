const net = require('net');

let sum = 0;
let clientSockets = [];

const server = net.createServer((socket) => {
  console.log('Клиент подключен');
  clientSockets.push(socket);

  socket.on('data', (data) => {
    const number = data.readInt32BE();
    sum += number;

    console.log(`Получено число: ${number}. Текущая сумма: ${sum}`);
  });

  socket.on('end', () => {
    console.log('Клиент отключен');
    clientSockets = clientSockets.filter(s => s !== socket); 
  });
});

setInterval(() => {
  for (let socket of clientSockets) {
    socket.write(Buffer.from(sum.toString())); 
  }
}, 5000);

server.listen(2000, () => {
  console.log('Сервер запущен на порту 2000');
});
