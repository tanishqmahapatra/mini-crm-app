// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const customerRoutes = require('./routes/customerRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const audienceRoutes = require('./routes/audienceRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const messageRoutes = require('./routes/messageRoutes');
const redisClient = require('./redisClient'); // Import your redis client



const app = express();



// Example route to set data in Redis
app.get('/set-data', async (req, res) => {
  try {
    await redisClient.set('my-key', 'hello world');
    res.send('Data set in Redis');
  } catch (err) {
    console.error('Error setting data in Redis:', err);
    res.status(500).send('Error setting data in Redis');
  }
});

// Example route to get data from Redis
app.get('/get-data', async (req, res) => {
  try {
    const value = await redisClient.get('my-key');
    res.send(`Stored value: ${value}`);
  } catch (err) {
    console.error('Error getting data from Redis:', err);
    res.status(500).send('Error getting data from Redis');
  }
});


// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000', // Allow frontend to connect
    credentials: true, // Allow cookies to be sent cross-origin
}));

// Parse JSON requests
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Set up session handling for Passport
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/auth/google/callback', // Adjust as needed
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile); // This can be extended to save user info in the database if required
}));

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Google Authentication Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Redirect to frontend after successful login
        res.redirect('http://localhost:3000/dashboard');
    }
);

// Route to check if the user is logged in
app.get('/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ loggedIn: true, user: req.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Route to log out the user
app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.redirect('http://localhost:3000');
    });
});

// Use routes
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/audience', audienceRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
    res.send('Server is running!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
