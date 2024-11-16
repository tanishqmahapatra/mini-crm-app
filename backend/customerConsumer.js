require('dotenv').config();
const mongoose = require('mongoose');
const redis = require('redis');
const Customer = require('./models/Customer'); // Import the Customer model

// Initialize Redis Subscriber
const redisSubscriber = redis.createClient({ url: 'redis://red-css843hu0jms73e79m40:6379' });

// Connect to Redis
redisSubscriber.connect().catch(console.error);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Subscribe to 'customerChannel' and define the message handler directly
redisSubscriber.subscribe('customerChannel', async (message) => {
    console.log('Received message from Redis:', message);

    try {
        const customerData = JSON.parse(message); // Parse the message to an object

        // Insert customer data into MongoDB
        const newCustomer = new Customer(customerData);
        await newCustomer.save();

        console.log('Customer data saved to MongoDB:', customerData);
    } catch (error) {
        console.error('Failed to process and save customer data:', error);
    }
});
