const crypto = require('crypto');
const users = require('../users.json');

// Секрет для подписи cookie (должен совпадать с server.js)
const COOKIE_SECRET = 'UNXkwyapFByCSTbDfEy16BeXuJd6j/9CDN2B1YZMBIpFOpQ0xFX+CZa/q3Ak7MuqhHKbx0IfRalK1DyDKfzHlXH8mc0VUYA1uQCzuXSdMJXalgCxWcmM7Vp9wkFui8bw49wdKdvzS0wP47OgFW0yhcav9N9yXGckodXbxJyT9QLsftLQXFvfPIWNc4tGxhjYDBOMBZi64JWOTMxMMm7+NoZH2Wk1JyPCakHPA==';

// Функция для создания HMAC-подписи
function signCookie(value) {
  return crypto.createHmac('sha256', COOKIE_SECRET).update(value).digest('hex');
}

// Функция для парсинга cookies
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

/**
 * Middleware для аутентификации пользователя через форму.
 * Проверяет логин и пароль, устанавливает подписанные cookie при успехе.
 */
const authenticate = (req, res, next) => {
  const { username, password } = req.body;

  // Проверка наличия логина и пароля
  if (!username || !password) {
    console.log('Ошибка: логин и пароль обязательны');
    return res.status(400).json({ error: 'Логин и пароль обязательны' });
  }

  // Поиск пользователя
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    console.log('Неверные учетные данные для:', username);
    return res.status(401).json({ error: 'Неверные учетные данные' });
  }

  // Создание cookie с именем пользователя и подписью
  const userCookie = username;
  const signature = signCookie(userCookie);
  console.log('Установка cookie для:', username, 'Signature:', signature);

  // Установка cookie через заголовок Set-Cookie
  res.setHeader('Set-Cookie', [
    `user=${userCookie}; Path=/; HttpOnly; SameSite=Strict`,
    `signature=${signature}; Path=/; HttpOnly; SameSite=Strict`
  ]);

  // Сохранение пользователя в req.user для текущего запроса
  req.user = { username: user.username };
  console.log('Cookie установлены для:', user.username);
  next();
};

/**
 * Middleware для защиты маршрутов.
 * Проверяет наличие и валидность cookie, извлекает пользователя.
 */
const ensureAuthenticated = (req, res, next) => {
  // Извлечение cookie из заголовка
  const cookies = parseCookies(req.headers.cookie);
  const userCookie = cookies.user;
  const signature = cookies.signature;

  // Проверка наличия cookie
  if (!userCookie || !signature) {
    console.log('Cookie отсутствуют, перенаправление на /');
    return res.redirect('/');
  }

  // Проверка подписи
  const expectedSignature = signCookie(userCookie);
  if (signature !== expectedSignature) {
    console.log('Неверная подпись cookie для:', userCookie);
    return res.redirect('/');
  }

  // Проверка, существует ли пользователь
  const user = users.find(u => u.username === userCookie);
  if (!user) {
    console.log('Пользователь из cookie не найден:', userCookie);
    return res.redirect('/');
  }

  // Сохранение пользователя в req.user
  req.user = { username: user.username };
  console.log('Cookie подтверждены для:', req.user.username);
  next();
};

module.exports = {
  authenticate,
  ensureAuthenticated
};