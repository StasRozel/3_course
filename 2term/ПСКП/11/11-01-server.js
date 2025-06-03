const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const PORT = 4000;
const UPLOAD_DIR = path.join(__dirname, 'upload');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
  console.log('Клиент подключился');

  let fileStream = null;

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      const filename = 'example.txt';

      if (message.type === 'start') {
        const filePath = path.join(UPLOAD_DIR, message.filename);
        fileStream = fs.createWriteStream(filePath);
        console.log(`Начата запись файла: ${message.filename}`);
      } else if (message.type === 'chunk') {
        if (fileStream) {
          fileStream.write(Buffer.from(message.data, 'base64'));
        }
      } else if (message.type === 'end') {
        if (fileStream) {
          fileStream.end();
          console.log(`Файл ${filename} успешно сохранен`);
          ws.send(JSON.stringify({ type: 'success', message: `Файл ${filename} принят и сохранен` }));
          fileStream = null;
        }
      }
    } catch (err) {
      console.error('Ошибка при обработке сообщения:', err.message);
      ws.send(JSON.stringify({ type: 'error', message: 'Ошибка обработки данных' }));
      if (fileStream) {
        fileStream.destroy();
        fileStream = null;
      }
    }
  });

  ws.on('close', () => {
    console.log('Клиент отключился');
    if (fileStream) {
      fileStream.destroy();
    }
  });
});

console.log(`WS-сервер запущен на порту ${PORT}`);