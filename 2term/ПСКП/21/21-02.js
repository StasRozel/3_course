const express = require('express');
const passport = require('passport');
const { DigestStrategy } = require('passport-http');
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

passport.use(new DigestStrategy(
  { qop: 'auth', realm: 'http://localhost:3000/resource' },
  (username, done) => {
    console.log(`Проверка пользователя: ${username}`);
    const user = users.find(u => u.username === username);
    if (!user) {
      console.log('Пользователь не найден');
      return done(null, false, { message: 'Пользователь не найден' });
    }
    console.log('Пользователь найден:', user);
    return done(null, user, user.password);
  }
));

const ensureAuthenticated = (req, res, next) => {
  console.log('Проверка аутентификации, Authorization:', req.headers['authorization'] || 'отсутствует');
  passport.authenticate('digest', { session: false }, (err, user, info) => {
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
  console.log('Запрос к /, отправка 21-02.html');
  res.sendFile(path.join(__dirname, 'view', '21-02.html'));
});

app.post('/login', passport.authenticate('digest', { session: false }), (req, res) => {
  console.log('Успешный логин для пользователя:', req.user.username);
  res.setHeader('Content-Type', 'application/json');
  res.json({ redirect: '/resource' });
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