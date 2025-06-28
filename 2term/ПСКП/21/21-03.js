const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const formsAuth = require('./middlewares/authMiddleware');

const app = express();
const port = 3000;

// Секрет для подписи cookie
const COOKIE_SECRET = 'UNXkwyapFByCSTbDfEy16BeXuJd6j/9CDN2B1YZMBIpFOpQ0xFX+CZa/q3Ak7MuqhHKbx0IfRalK1DyDKfzHlXH8mc0VUYA1uQCzuXSdMJXalgCxWcmM7Vp9wkFui8bw49wdKdvzS0wP47OgFW0yhcav9N9yXGckodXbxJyT9QLsftLQXFvfPIWNc4tGxhjYDBOMBZi64JWOTMxMMm7+NoZH2Wk1JyPCakHPA==';

// Middleware для парсинга тела запроса
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Обслуживание статических файлов из папки view
app.use(express.static(path.join(__dirname, 'view')));

// Логирование всех входящих запросов
app.use((req, res, next) => {
  const userCookie = req.headers.cookie ? parseCookies(req.headers.cookie).user : 'отсутствует';
  console.log(`Входящий запрос: ${req.method} ${req.url}, Cookie user: ${userCookie}`);
  next();
});

// Парсинг cookies из заголовка
function parseCookies(cookieHeader) {
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
    });
  }
  return cookies;
}

// Главная страница
app.get('/', (req, res) => {
  console.log('Запрос к /, отправка 21-03.html');
  res.sendFile(path.join(__dirname, 'view', '21-03.html'));
});

// Обработка логина
app.post('/login', formsAuth.authenticate, (req, res) => {
  console.log('Успешный логин для пользователя:', req.user.username);
  res.setHeader('Content-Type', 'application/json');
  res.json({ aoba: '/resource' });
});

// Обработка выхода
app.get('/logout', (req, res) => {
  console.log('Выход, очистка cookie');
  // Устанавливаем cookie с пустым значением и истекшим сроком действия
  res.setHeader('Set-Cookie', [
    'user=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'signature=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  ]);
  res.redirect('/');
});

// Защищенный ресурс
app.get('/resource', formsAuth.ensureAuthenticated, (req, res) => {
  console.log('Доступ к /resource предоставлен для:', req.user.username);
  res.sendFile(path.join(__dirname, 'view', 'resource.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err.stack);
  res.status(500).json({ error: 'Ошибка сервера' });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});