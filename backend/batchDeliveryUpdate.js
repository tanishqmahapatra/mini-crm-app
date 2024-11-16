require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const CommunicationsLog = require('./models/CommunicationsLog'); // Import the model for message logs

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Function to update delivery status for all "PENDING" messages
async function updatePendingDeliveries() {
    try {
        // Fetch all communications logs with "PENDING" status
        const pendingLogs = await CommunicationsLog.find({ status: 'PENDING' });
        console.log(`Found ${pendingLogs.length} pending messages`);

        // Loop through each pending message and call the Delivery Receipt API
        for (const log of pendingLogs) {
            try {
                const response = await axios.post(`http://localhost:3001/api/messages/delivery/${log._id}`);
                console.log(`Delivery status updated for logId: ${log._id} - Status: ${response.data.status}`);
            } catch (error) {
                console.error(`Failed to update delivery status for logId: ${log._id}`, error.message);
            }
        }

        console.log('Batch delivery update completed');
    } catch (error) {
        console.error('Error updating pending deliveries:', error.message);
    } finally {
        mongoose.connection.close();
    }
}

// Run the function
updatePendingDeliveries();
