const http = require("http");
 
http.createServer(function(request, response){
    response.setHeader("Content-Type", "text/html; charset=utf-8;");

    response.end(`
                <h2>Uri: ${request.url}</h2>
                <h2>Тип запроса: ${request.method}</h2>
                <h2>User-Agent: ${request.headers["user-agent"]}</h2>
                <h2>User-Agent: ${request.httpVersion}</h2>
                <h2>Headers: ${JSON.stringify(request.headers, null, 2)}</h2>
                `);
}).listen(3000, function(){ console.log("Сервер запущен по адресу http://localhost:3000")});