const redis = require('redis');

// Use the REDIS_URL environment variable for the connection string
const redisUrl = process.env.REDIS_URL || 'redis://red-css843hu0jms73e79m40:6379'; // Default to localhost if the environment variable is not set

const redisClient = redis.createClient({
  url: redisUrl,
});

redisClient.on('error', (error) => {
  console.error('Redis connection error:', error);
});

// Connect to Redis and export the client
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

module.exports = redisClient;
