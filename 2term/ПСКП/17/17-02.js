const { createClient } = require('redis');

async function benchmarkRedis() {
  console.time('Total execution time');
  
  const client = createClient({
    url: 'redis://localhost:6379'
  });

  client.on('error', (err) => console.error('Redis Client Error:', err));
  
  client.on('connect', () => {
    console.log('Successfully connected to Redis!');
  });

  await client.connect();
  console.log('Connection established, starting benchmark...');

  const iterations = 10000;
  const key_prefix = 'benchmark:';
  
  // Тест операций SET
  console.time('SET operations');
  for (let i = 0; i < iterations; i++) {
    await client.set(`${key_prefix}${i}`, `value${i}`);
  }
  console.timeEnd('SET operations');
  
  // Тест операций GET
  console.time('GET operations');
  for (let i = 0; i < iterations; i++) {
    await client.get(`${key_prefix}${i}`);
  }
  console.timeEnd('GET operations');
  
  // Тест операций DEL
  console.time('DEL operations');
  for (let i = 0; i < iterations; i++) {
    await client.del(`${key_prefix}${i}`);
  }
  console.timeEnd('DEL operations');

  await client.disconnect();
  console.log('Benchmark completed, connection closed.');
  
  console.timeEnd('Total execution time');
}

benchmarkRedis().catch(err => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
