const express = require("express");

const app = express();

let server;

app.get("/connection", (req, res) => {
  const time = req.query.set ? req.query.set : 5000;
  server.keepAliveTimeout = Number(time);
  res.send(`KeepAliveTimeout: ${server.keepAliveTimeout}`);
  res.end();
});

app.get("/headers", (req, res) => {
  let string = '<br>';

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'max-age=3600');
  res.setHeader('Last-Modified', new Date().toUTCString());
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('X-Custom-Header', 'Hello, World!');

  for (const [key, value] of Object.entries(res.getHeaders())) {
    string += `${key}: ${value}`;
  }

  res.send(`<div>${req.rawHeaders}</div><div>${string}</div>`);
  res.end();
});

app.get("/parameter", (req, res) => {
  const x = Number(req.query.x);
  const y = Number(req.query.y);
  if(!isNaN(x) && !isNaN(y)) {
    res.send(`x+y=${x+y} x-y=${x-y} x*y=${x * y} x/y=${x / y}`);
  } else {
    res.send('Error type in parameters');
  }
});

app.get("/parameter/:x/:y", (req, res) => {
  const x = Number(req.params.x);
  const y = Number(req.params.y);
  if(!isNaN(x) && !isNaN(y)) {
    res.send(`x+y=${x+y} x-y=${x-y} x*y=${x * y} x/y=${x / y}`);
  } else {
    res.send('Error type in parameters');
  }
});

app.get("/close", (req, res) => {
  server.close(() => {
    console.log('Сервер остановлен');
    process.exit(0);
  });
  res.send('Сервер останавливается...');
});

app.get("/socket", (req, res) => {
  const clientIp = req.socket.remoteAddress;
  const clientPort = req.socket.remotePort;
  const serverIp = req.socket.localAddress;
  const serverPort = req.socket.localPort;

  const responseHtml = `
    <h1>Информация о подключении</h1>
    <p>IP-адрес клиента: ${clientIp}</p>
    <p>Порт клиента: ${clientPort}</p>
    <p>IP-адрес сервера: ${serverIp}</p>
    <p>Порт сервера: ${serverPort}</p>
  `;

  res.send(responseHtml);
});


app.get('/req-data', (req, res) => {
  let data = '';

  req.on('data', (chunk) => {
    console.log(`Получен ${chunk.length} байтов данных`);
    data += chunk.toString();
  });

  req.on('end', () => {
    console.log(`Всего получено ${data.length} байтов данных`);
    fs.writeFile('request_data.txt', data, (err) => {
      if (err) {
        console.error('Ошибка при записи файла:', err);
        res.status(500).send('Ошибка при обработке запроса');
      } else {
        res.send('Данные успешно сохранены');
      }
    });
  });
});

app.get("/resp-status", (req, res) => {
  // Handle "GET /resp-status?code=c?mess=m" request
  res.status(200).send("GET /resp-status?code=c?mess=m");
});

app.post("/formparameter", (req, res) => {
  // Handle "POST /formparameter" request
  res.status(200).send("POST /formparameter");
});

app.post("/json", (req, res) => {
  // Handle "POST /json" request
  res.status(200).send("POST /json");
});

app.post("/xml", (req, res) => {
  // Handle "POST /xml" request
  res.status(200).send("POST /xml");
});

app.get("/files", (req, res) => {
  // Handle "GET /files" request
  res.status(200).send("GET /files");
});

app.get("/files/:filename", (req, res) => {
  // Handle "GET /files/filename" request
  res.status(200).send(`GET /files/${req.params.filename}`);
});

app.all("/upload", (req, res) => {
  // Handle "GET/POST /upload" request
  res.status(200).send("GET/POST /upload");
});

app.use((req, res) => {
  // Handle unknown routes
  res.status(404).send("Not found");
});
server = app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});
