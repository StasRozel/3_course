const { createClient } = require('redis');

async function benchmarkIncrDecr() {
  console.time('Total execution time');
  
  // Создаем клиент Redis
  const client = createClient({
    url: 'redis://localhost:6379'
  });

  // Обработчики событий
  client.on('error', (err) => console.error('Redis Client Error:', err));
  
  client.on('connect', () => {
    console.log('Successfully connected to Redis!');
  });

  // Подключаемся к Redis
  await client.connect();
  console.log('Connection established, starting benchmark...');

  const iterations = 10000;
  const key = 'counter:benchmark';
  
  await client.set(key, '0');
  
  // Тест операций INCR
  console.time('INCR operations');
  for (let i = 0; i < iterations; i++) {
    await client.incr(key);
  }
  console.timeEnd('INCR operations');
  
  // Проверяем результат INCR
  const incrResult = await client.get(key);
  console.log(`Counter value after ${iterations} INCR operations: ${incrResult}`);
  
  // Тест операций DECR
  console.time('DECR operations');
  for (let i = 0; i < iterations; i++) {
    await client.decr(key);
  }
  console.timeEnd('DECR operations');
  
  // Проверяем результат DECR
  const decrResult = await client.get(key);
  console.log(`Counter value after ${iterations} DECR operations: ${decrResult}`);

  await client.del(key);
  
  await client.disconnect();
  console.log('Benchmark completed, connection closed.');
  
  console.timeEnd('Total execution time');
}

benchmarkIncrDecr().catch(err => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
