const express = require('express');
const bodyParser = require('body-parser');
const { wss } = require('./websocket');
const studentsRouter = require('./routes/students');
const backupRouter = require('./routes/backup');

const app = express();
app.use(bodyParser.json());

app.use('/backup', backupRouter);
app.use('/', studentsRouter);

const server = app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
