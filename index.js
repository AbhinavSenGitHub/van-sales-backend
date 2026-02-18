const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const journeyPlanRoutes = require('./routes/journeyPlanRoute');
const authRoutes = require('./routes/authRoute');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Optimize: allow only specific origins in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Performance Middlewares
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/journey-plans', journeyPlanRoutes);

// Base Route
app.get('/', (req, res) => {
    res.json({ status: 'success', message: 'FMCG Journey Planner API is optimized and running' });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

const server = app.listen(PORT, () => {
    console.log(`Optimized Server is running on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(async () => {
        console.log('HTTP server closed');
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
            process.exit(0);
        } catch (err) {
            console.error('Error during MongoDB close:', err);
            process.exit(1);
        }
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(async () => {
        console.log('HTTP server closed');
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
            process.exit(0);
        } catch (err) {
            console.error('Error during MongoDB close:', err);
            process.exit(1);
        }
    });
});
