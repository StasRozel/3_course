const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const PORT = 4000;
const DOWNLOAD_DIR = path.join(__dirname, 'download');

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
  console.log(`Создана директория ${DOWNLOAD_DIR}. Поместите файлы для отправки туда.`);
}

const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
  console.log('Клиент подключился');

  ws.on('message', (message) => {
    const filename = message.toString();
    const filePath = path.join(DOWNLOAD_DIR, filename);

    if (fs.existsSync(filePath)) {
      const fileStream = fs.createReadStream(filePath, { highWaterMark: 64 * 1024 }); 

      ws.send(JSON.stringify({ type: 'start', filename }));

      fileStream.on('data', (chunk) => {
        ws.send(JSON.stringify({
          type: 'chunk',
          data: chunk.toString('base64'), 
        }));
      });

      fileStream.on('end', () => {
        ws.send(JSON.stringify({ type: 'end', filename }));
        console.log(`Файл ${filename} отправлен клиенту`);
      });

      fileStream.on('error', (err) => {
        console.error('Ошибка чтения файла:', err);
        ws.send(JSON.stringify({ type: 'error', message: 'Ошибка при чтении файла' }));
      });
    } else {
      ws.send(JSON.stringify({ type: 'error', message: `Файл ${filename} не найден` }));
      console.log(`Файл ${filename} не найден в директории ${DOWNLOAD_DIR}`);
    }
  });

  ws.on('close', () => {
    console.log('Клиент отключился');
  });
});

console.log(`WS-сервер запущен на порту ${PORT}`);
