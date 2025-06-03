const WebSocket = require('rpc-websockets').Client;

const SERVER_URL = 'ws://localhost:4000';

const ws = new WebSocket(SERVER_URL);

const rpcCalls = [
  { method: 'square', params: [3] },
  { method: 'square', params: [5, 4] },
  { method: 'sum', params: [2] },
  { method: 'sum', params: [2, 4, 6, 8, 10] },
  { method: 'mul', params: [3] },
  { method: 'mul', params: [3, 5, 7, 9, 11, 13] },
  { method: 'fib', params: [1] },
  { method: 'fib', params: [2] },
  { method: 'fib', params: [7] },
  { method: 'fact', params: [0] },
  { method: 'fact', params: [5] },
  { method: 'fact', params: [10] },
];

ws.on('open', async () => {
  console.log('Подключено к серверу');

  try {
    const loginResponse = await ws.call('login', { username: 'aBIIB', password: 'aboba2004' });
    console.log(loginResponse); 

    for (const call of rpcCalls) {
      try {
        const result = await ws.call(call.method, call.params);
        console.log(`Ответ на ${call.method}(${call.params.join(', ')}):`, result);
      } catch (err) {
        console.error(`Ошибка при вызове ${call.method}(${call.params.join(', ')}):`, err.message);
      }
    }

    const logoutResponse = await ws.call('logout');
    console.log(logoutResponse); 
  } catch (err) {
    console.error('Ошибка:', err.message);
  } finally {
    ws.close();
  }
});

ws.on('close', () => {
  console.log('Соединение закрыто');
});

ws.on('error', (err) => {
  console.error('Ошибка WebSocket:', err.message);
});
