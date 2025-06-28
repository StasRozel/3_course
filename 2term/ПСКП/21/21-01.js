const express = require('express');
const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const bodyParser = require('body-parser');
const path = require('path');

const users = require('./users.json');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'view')));

app.use((req, res, next) => {
  console.log(`Входящий запрос: ${req.method} ${req.url}, Authorization: ${req.headers['authorization'] || 'отсутствует'}`);
  next();
});

passport.use(new BasicStrategy(
  (username, password, done) => {
    console.log(`Проверка пользователя: ${username}`);
    const decodedUsername = decodeURIComponent(username);
    const decodedPassword = decodeURIComponent(password);
    const user = users.find(u => u.username === decodedUsername && u.password === decodedPassword);
    if (!user) {
      console.log('Неверные учетные данные');
      return done(null, false, { message: 'Неверные учетные данные' });
    }
    console.log('Пользователь найден:', user);
    return done(null, user);
  }
));

const ensureAuthenticated = (req, res, next) => {
  console.log('Проверка аутентификации для /resource, Authorization:', req.headers['authorization'] || 'отсутствует');
  passport.authenticate('basic', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Ошибка аутентификации:', err);
      return next(err);
    }
    if (!user) {
      console.log('Аутентификация не пройдена, перенаправление на /');
      return res.redirect('/');
    }
    req.user = user;
    next();
  })(req, res, next);
};

app.get('/', (req, res) => {
  console.log('Запрос к /, отправка 21-01.html');
  res.sendFile(path.join(__dirname, 'view', '21-01.html'));
});

app.post('/login', passport.authenticate('basic', { session: false }), (req, res) => {
  console.log('Успешный логин для пользователя:', req.user.username);
  const authHeader = req.headers['authorization'] || '';
  res.setHeader('Content-Type', 'application/json');
  res.json({ redirect: '/resource', authHeader });
});

app.get('/logout', (req, res) => {
  console.log('Выход, перенаправление на /');
  res.redirect('/');
});

app.get('/resource', ensureAuthenticated, (req, res) => {
  console.log('Доступ к /resource предоставлен для:', req.user.username);
  res.sendFile(path.join(__dirname, 'view', 'resource.html'));
});

app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err.stack);
  res.status(500).json({ error: 'Ошибка сервера' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});