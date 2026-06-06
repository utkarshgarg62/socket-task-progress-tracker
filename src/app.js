import express from 'express';
import cors from 'cors';
import { registerRoutes } from './loaders/routes.js';
import { errorHandler } from './api/middlewares/errorMiddleware.js';

const app = express();

// Apply CORS support
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Setup built-in parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic landing endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API Logger Monitor Backend is Running.'
    });
});

// Register REST API routes
registerRoutes(app);

// Catch-all for undefined routes (404)
app.use((req, res, next) => {
    const error = new Error(`Resource not found: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

// Register global error handler middleware
app.use(errorHandler);

export default app;
