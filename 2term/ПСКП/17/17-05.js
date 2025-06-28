const { createClient } = require('redis');

async function createRedisClient(name) {
  const client = createClient({
    url: 'redis://localhost:6379'
  });

  client.on('error', (err) => console.error(`[${name}] Redis Client Error:`, err));
  
  client.on('connect', () => {
    console.log(`[${name}] Successfully connected to Redis!`);
  });

  await client.connect();
  console.log(`[${name}] Connection established`);
  
  return client;
}

async function runPubSubDemo() {
  console.log('Starting Redis Publish/Subscribe demonstration...');
  
  const publisher = await createRedisClient('Publisher');
  const subscriber1 = await createRedisClient('Subscriber1');
  const subscriber2 = await createRedisClient('Subscriber2');
  
  const channel1 = 'news:technology';
  const channel2 = 'news:sports';
  
  await subscriber1.subscribe(channel1, (message, channel) => {
    console.log(`[Subscriber1] Received message on channel "${channel}": ${message}`);
  });
  
  await subscriber1.subscribe(channel2, (message, channel) => {
    console.log(`[Subscriber1] Received message on channel "${channel}": ${message}`);
  });
  
  await subscriber2.subscribe(channel2, (message, channel) => {
    console.log(`[Subscriber2] Received message on channel "${channel}": ${message}`);
  });
  
  console.log(`[Subscriber1] Subscribed to: ${channel1}, ${channel2}`);
  console.log(`[Subscriber2] Subscribed to: ${channel2}`);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('\n--- Publishing messages ---');
  
  console.log(`[Publisher] Publishing to ${channel1}`);
  await publisher.publish(channel1, 'New AI breakthrough announced!');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`[Publisher] Publishing to ${channel2}`);
  await publisher.publish(channel2, 'Team wins championship!');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('\n--- Unsubscribing ---');
  console.log(`[Subscriber1] Unsubscribing from ${channel1}`);
  await subscriber1.unsubscribe(channel1);

  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('\n--- Publishing after unsubscribe ---');
  console.log(`[Publisher] Publishing to ${channel1} again`);
  await publisher.publish(channel1, 'This message will not be received by Subscriber1!');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`[Publisher] Publishing to ${channel2} again`);
  await publisher.publish(channel2, 'Both subscribers should still receive this message!');
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('\n--- Cleaning up ---');
  
  await subscriber1.unsubscribe(channel2);
  await subscriber2.unsubscribe(channel2);Publisher
  
  await subscriber1.disconnect();
  await subscriber2.disconnect();
  await publisher.disconnect();
  
  console.log('Demo completed, all connections closed.');
}

// Запускаем демонстрацию
runPubSubDemo().catch(err => {
  console.error('Demo failed:', err);
  process.exit(1);
});