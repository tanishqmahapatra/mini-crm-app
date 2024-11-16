const redis = require('redis');

const redisClient = redis.createClient({ url: 'redis://localhost:6379' });

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
