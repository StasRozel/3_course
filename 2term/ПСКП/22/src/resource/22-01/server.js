const https = require('https');
const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, '../certificates', 'resource.key');
const certPath = path.join(__dirname, '../certificates', 'resource.crt');

const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
};

const server = https.createServer(options, (req, res) => {
    if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('HTTPS IS WORKING!\n');
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('NOT SUPPORTED\n');
    }
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на https://localhost:${PORT}`);
});