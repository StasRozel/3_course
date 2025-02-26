const http = require("http");

const server = http.createServer((req, res) => {res.end("<h1>Hello World<h1>");})

server.listen(3000, function(){ console.log("Сервер запущен по адресу http://localhost:3000")});