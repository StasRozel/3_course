const WebSocket = require('rpc-websockets').Client;

const SERVER_URL = 'ws://localhost:4000';

const makeRpcCall = async (method, params) => {
  const ws = new WebSocket(SERVER_URL);

  return new Promise((resolve, reject) => {
    ws.on('open', async () => {
      try {
        if (method === 'fib' || method === 'fact') {
          await ws.call('login', { username: 'Stas', password: 'aboba2004' });
        }

        const result = await ws.call(method, params);
        resolve({ method, result });

        if (method === 'fib' || method === 'fact') {
          await ws.call('logout');
        }
      } catch (err) {
        reject(err);
      } finally {
        ws.close();
      }
    });

    ws.on('error', (err) => reject(err));
  });
};

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

(async () => {
  try {
    const results = await Promise.all(
      rpcCalls.map((call) =>
          makeRpcCall(call.method, call.params).catch((err) => ({
            method: call.method,
            error: err.message,
          }))
      )
    );

    results.forEach(({ method, result, error }) => {
      if (error) {
        console.error(`Ошибка при вызове ${method}:`, error);
      } else {
        console.log(`Ответ на ${method}:`, result);
      }
    });
  } catch (err) {
    console.error('Ошибка:', err.message);
  }
})();
