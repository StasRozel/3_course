const { createClient } = require('redis');

async function connectToRedis() {
  const client = createClient({
    url: 'redis://localhost:6379'
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  client.on('connect', () => {
    console.log('Successful connection to Redis!');
  });

  await client.connect();
  
  await client.set('key', 'value');
  const value = await client.get('key');
  console.log(value);
  
  await client.disconnect();
}


connectToRedis();