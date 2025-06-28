const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// WASM-код функций sum, sub, mul, div
const wasmCode = new Uint8Array([0,97,115,109,1,0,0,0,1,7,1,96,2,127,127,1,127,3,5,4,0,0,0,0,7,25,4,3,115,117,109,0,0,3,115,117,98,0,1,3,109,117,108,0,2,3,100,105,118,0,3,10,33,4,7,0,32,0,32,1,106,11,7,0,32,0,32,1,107,11,7,0,32,0,32,1,108,11,7,0,32,0,32,1,109,11]);

// Настройка CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Статические файлы (для CSS, JS, изображений если нужно)
app.use(express.static(path.join(__dirname, 'public')));

// Главная страница - отправка HTML файла
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'), (err) => {
        if (err) {
            res.status(404).send(`
                <h1>Ошибка 404</h1>
                <p>HTML файл не найден.</p>
                <p>Убедитесь, что файл <strong>index.html</strong> находится в той же папке, что и server.js</p>
            `);
        }
    });
});

// Эндпоинт для получения WASM-кода
app.get('/wasm', (req, res) => {
    res.set({
        'Content-Type': 'application/wasm',
        'Content-Length': wasmCode.length
    });
    res.send(Buffer.from(wasmCode));
});

// API эндпоинт для информации о WASM модуле
app.get('/api/wasm-info', (req, res) => {
    res.json({
        size: wasmCode.length,
        functions: ['sum', 'sub', 'mul', 'div'],
        description: 'WebAssembly module with basic arithmetic operations',
        version: '1.0.0'
    });
});

// Обработка 404 ошибок
app.use((req, res) => {
    res.status(404).send(`
        <h1>Страница не найдена</h1>
        <p>Запрашиваемый ресурс <strong>${req.url}</strong> не существует.</p>
        <p><a href="/">Перейти на главную страницу</a></p>
    `);
});

// Обработка ошибок сервера
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err.stack);
    res.status(500).send(`
        <h1>Ошибка сервера</h1>
        <p>Произошла внутренняя ошибка сервера.</p>
        <p>Проверьте консоль для получения подробной информации.</p>
    `);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log('🚀 Express сервер запущен!');
    console.log(`📱 Главная страница: http://localhost:${PORT}`);
    console.log(`🔧 WASM эндпоинт: http://localhost:${PORT}/wasm`);
    console.log(`📊 Информация о WASM: http://localhost:${PORT}/api/wasm-info`);
    console.log(`📄 Убедитесь, что файл index.html находится в корне проекта`);
    console.log('─'.repeat(50));
});