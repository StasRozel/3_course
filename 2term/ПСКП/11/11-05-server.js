
const WebSocket = require('rpc-websockets').Server;

const PORT = 4000;
const wss = new WebSocket({ port: PORT });

const calculateFib = (n) => {
  if (n <= 0) return [];
  const fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib.slice(0, n);
};

const factorial = (n) => {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};

const authorizedUsers = new Set();

wss.register('login', (params, socket) => {
  const { username, password } = params;
  if (username === 'Stas' && password === 'aboba2004') {
    authorizedUsers.add(socket);
    return 'Авторизация успешна';
  } else {
    return 'biba'
  }
});

wss.register('logout', (params, socket) => {
  authorizedUsers.delete(socket);
  return 'Выход выполнен';
});

wss.register('fib', (params, socket) => {
  if (!authorizedUsers.has(socket)) {
    return 'нет разрешения'
  }
  if (params.length === 1) {
    const [n] = params;
    return calculateFib(n);
  } else {
    throw new Error('Неверное количество параметров для fib');
  }
});

wss.register('fact', (params, socket) => {
  if (!authorizedUsers.has(socket)) {
    return 'нет разрешения'
  }
  if (params.length === 1) {
    const [n] = params;
    return factorial(n);
  } else {
    throw new Error('Неверное количество параметров для fact');
  }
});

wss.register('square', (params, socket) => {
  if (params.length === 1) {
    const [r] = params;
    return Math.PI * r * r;
  } else if (params.length === 2) {
    const [a, b] = params;
    return a * b;
  } else {
    throw new Error('Неверное количество параметров для square');
  }
});

wss.register('sum', (params, socket) => {
  return params.reduce((acc, val) => acc + val, 0);
});

wss.register('mul', (params, socket) => {
  return params.reduce((acc, val) => acc * val, 1);
});

wss.on('connection', (socket) => {
  console.log('Клиент подключился');

  socket.on('close', () => {
    authorizedUsers.delete(socket);
    console.log('Клиент отключился');
  });
});

console.log(`WS-сервер запущен на порту ${PORT}`);
