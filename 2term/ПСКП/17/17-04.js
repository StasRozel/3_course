const { createClient } = require('redis');

async function benchmarkHashOperations() {
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
  const hashKey = 'benchmark:hash';
  
  await client.del(hashKey);
  
  console.time('HSET operations');
  for (let i = 0; i < iterations; i++) {
    await client.hSet(hashKey, `field${i}`, `value${i}`);
  }
  console.timeEnd('HSET operations');
  
  const hashSize = await client.hLen(hashKey);
  console.log(`Hash size after HSET operations: ${hashSize}`);
  
  console.time('HGET operations');
  for (let i = 0; i < iterations; i++) {
    await client.hGet(hashKey, `field${i}`);
  }
  console.timeEnd('HGET operations');

  await client.del(hashKey);
  console.log('Test hash has been removed');
  
  await client.disconnect();
  console.log('Benchmark completed, connection closed.');
  
  console.timeEnd('Total execution time');
}

benchmarkHashOperations().catch(err => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});