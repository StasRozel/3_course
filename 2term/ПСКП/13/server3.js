const net = require('net');

let clientsData = {};

const server = net.createServer((socket) => {
  console.log('Новый клиент подключился');

  const clientId = socket.remoteAddress + ':' + socket.remotePort;
  clientsData[clientId] = { sum: 0, socket: socket };

  socket.on('data', (data) => {
    const number = data.readInt32BE();
    clientsData[clientId].sum += number; 

    console.log(`Клиент ${clientId} отправил число: ${number}. Текущая сумма: ${clientsData[clientId].sum}`);
  });

  setInterval(() => {
    if (clientsData[clientId]) {
      const currentSum = clientsData[clientId].sum;
      clientsData[clientId].socket.write(Buffer.from(currentSum.toString())); 
      console.log(`Отправлена промежуточная сумма клиенту ${clientId}: ${currentSum}`);
    }
  }, 5000);

  socket.on('end', () => {
    console.log('Клиент отключился');
    delete clientsData[clientId]; 
  });
});

server.listen(2000, () => {
  console.log('Сервер запущен на порту 2000');
});
