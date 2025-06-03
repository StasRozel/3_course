const WebSocket = require('rpc-websockets').Client;

const SERVER_URL = 'ws://localhost:4000';

(async () => {
  const ws = new WebSocket(SERVER_URL);

  try {
    await new Promise((resolve, reject) => {
      ws.on('open', resolve);
      ws.on('error', reject);
    });

    await ws.call('login', { username: 'Stas', password: 'aboba2004' });

    const square3 = await ws.call('square', [3]);
    console.log('square(3):', square3);

    const square5_4 = await ws.call('square', [5, 4]);
    console.log('square(5, 4):', square5_4);

    const mulResult = await ws.call('mul', [3, 5, 7, 9, 11, 13]);
    console.log('mul(3, 5, 7, 9, 11, 13):', mulResult);

    const fib7 = await ws.call('fib', [7]);

    if(fib7==='нет разрешения'){
      console.log('абоба')
      return;
    }
    console.log('fib(7):', fib7);

    const sumResult = await ws.call('sum', [square3, square5_4, mulResult]);
    console.log('sum(square3, square5_4, mulResult):', sumResult);

    const finalResult = await ws.call('mul', [2, 4, 6]);
    console.log('mul(2, 4, 6):', finalResult);

    const result = sumResult + fib7.length * finalResult;
    console.log('Результат выражения:', result);

    await ws.call('logout');
  } catch (err) {
    console.error('Ошибка:', err.message);
  } finally {
    ws.close();
  }
})();
