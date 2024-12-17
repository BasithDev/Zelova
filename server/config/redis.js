const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
  host: 'localhost', // or your Redis server host
  port: 6379,        // default Redis port
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

// Promisify Redis client methods for async/await
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = { client, getAsync, setAsync };
