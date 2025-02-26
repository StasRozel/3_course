const express = require('express');
const app = express();
const port = 3000;

// Данные пользователей
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com' },
  { id: 5, name: 'Tom Davis', email: 'tom@example.com' },
  { id: 6, name: 'Samantha Brown', email: 'samantha@example.com' },
  { id: 7, name: 'Michael Wilson', email: 'michael@example.com' },
  { id: 8, name: 'Emily Garcia', email: 'emily@example.com' },
  { id: 9, name: 'David Lee', email: 'david@example.com' },
  { id: 10, name: 'Sarah Kim', email: 'sarah@example.com' }
];

// Middleware для парсинга JSON
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/script', (req, res) => {
  res.sendFile(__dirname + '/client.js');
})
// GET /users - получение списка пользователей
// app.get('/users', (req, res) => {
//   res.json(users);
// });

app.get('/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedUsers = users.slice(startIndex, endIndex);

  res.json({
    users: paginatedUsers,
    currentPage: page,
    totalPages: Math.ceil(users.length / limit)
  });
});

// GET /users/:id - получение информации о пользователе
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// POST /users - создание нового пользователя
// POST /users - создание нового пользователя
app.post('/users', (req, res) => {
  // Проверка типов данных
  if (typeof req.body.name !== 'string' || typeof req.body.email !== 'string') {
    return res.status(400).json({ error: 'Invalid data types' });
  }

  // Проверка наличия обязательных полей
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Создание нового пользователя
  const newUser = { id: users.length + 1, name: req.body.name, email: req.body.email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /users/:id - обновление информации о пользователе
app.put('/users/:id', (req, res) => {
  // Проверка типов данных
  if (typeof req.body.name !== 'string' || typeof req.body.email !== 'string') {
    return res.status(400).json({ error: 'Invalid data types' });
  }

  // Проверка наличия обязательных полей
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Поиск пользователя
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Обновление информации о пользователе
  user.name = req.body.name;
  user.email = req.body.email;
  res.status(201).json(user);
});

// DELETE /users/:id - удаление пользователя
// DELETE /users/:id - удаление пользователя
app.delete('/users/:id', (req, res) => {
  // Проверка типа данных
  if (req.params.id >= Number.MAX_VALUE) {
    return res.status(400).json({ error: 'Invalid' });
  }
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  if (typeof userId !== 'number') {
    return res.status(400).json({error: 'Invalid user type ID'})
  }
  
  // Поиск пользователя
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Удаление пользователя
  const deletedUser = users.splice(userIndex, 1)[0];
  res.status(200).json(deletedUser);
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});