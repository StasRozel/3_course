const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const SERVER_URL = 'ws://localhost:4000';
const FILE_TO_UPLOAD = path.join(__dirname, 'example.txt'); 


const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
  console.log('Подключено к серверу');

  if (!fs.existsSync(FILE_TO_UPLOAD)) {
    console.error('Файл для загрузки не найден:', FILE_TO_UPLOAD);
    ws.close();
    return;
  }

  const filename = path.basename(FILE_TO_UPLOAD);
  ws.send(JSON.stringify({ type: 'start', filename }));
  console.log(`Запрос на загрузку файла ${filename} отправлен серверу`);

  const fileStream = fs.createReadStream(FILE_TO_UPLOAD, { highWaterMark: 1024 });

  fileStream.on('data', (chunk) => {
    ws.send(JSON.stringify({ type: 'chunk', data: chunk.toString('base64') }));
    console.log('Отправлен кусок данных');
  });

  fileStream.on('end', () => {
    ws.send(JSON.stringify({ type: 'end' }));
    console.log(`Передача файла ${filename} завершена`);
  });

  fileStream.on('error', (err) => {
    console.error('Ошибка при чтении файла:', err.message);
    ws.send(JSON.stringify({ type: 'error', message: 'Ошибка чтения файла' }));
  });
});

ws.on('message', (message) => {
  const response = JSON.parse(message);

  if (response.type === 'success') {
    console.log('Сервер подтвердил успешную загрузку:', response.message);
  } else if (response.type === 'error') {
    console.error('Ошибка от сервера:', response.message);
  }
});

ws.on('close', () => {
  console.log('Соединение закрыто');
});

ws.on('error', (err) => {
  console.error('Ошибка WebSocket:', err.message);
});