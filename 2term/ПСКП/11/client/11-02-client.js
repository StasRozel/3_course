const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const SERVER_URL = 'ws://localhost:4000';
const SAVE_DIR = path.join(__dirname, 'received');

if (!fs.existsSync(SAVE_DIR)) {
  fs.mkdirSync(SAVE_DIR);
}

const ws = new WebSocket(SERVER_URL);

let fileStream = null;

ws.on('open', () => {
  console.log('Подключено к серверу');

  const filename = 'example.txt';
  ws.send(filename);
  console.log(`Запрос на файл ${filename} отправлен серверу`);
});

ws.on('message', (message) => {
  const response = JSON.parse(message);

  if (response.type === 'start') {
    const filePath = path.join(SAVE_DIR, response.filename);
    fileStream = fs.createWriteStream(filePath);
    console.log(`Начата запись файла: ${response.filename}`);
  } else if (response.type === 'chunk') {
    if (fileStream) {
      fileStream.write(Buffer.from(response.data, 'base64')); 
        }
  } else if (response.type === 'end') {
    if (fileStream) {
      fileStream.end();
      console.log(`Файл ${response.filename} сохранен в директории ${SAVE_DIR}`);
      fileStream = null;
    }
  } else if (response.type === 'error') {
    console.error('Ошибка от сервера:', response.message);
  }
});

ws.on('close', () => {
  console.log('Соединение закрыто');
  if (fileStream) {
    fileStream.destroy(); 
  }
});
