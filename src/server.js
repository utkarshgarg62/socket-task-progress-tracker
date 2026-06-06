import { createServer } from 'http';
import app from './app.js';
import { initSocket } from './loaders/socket.js';
import env from './config/env.js';

const NODE_ENV = process.env.NODE_ENV || 'development';
const config = env[NODE_ENV] || env.development;
const PORT = config.PORT || 5000;

const handleFatalError = (err) => {
    console.error('[Server] Fatal Error encountered:', err);
    process.exit(1);
};

// Handle process level exceptions/rejections
process.on('unhandledRejection', (reason) => {
    throw (reason instanceof Error ? reason : new Error(String(reason)));
});

process.on('uncaughtException', (err) => {
    handleFatalError(err);
});

// Create HTTP Server wrapping the Express app
const server = createServer(app);

// Bind Socket.IO real-time loader to the HTTP server
initSocket(server);

// Start listening for traffic
server.listen(PORT, () => {
    console.log(`\n🚀 Server initialized in "${NODE_ENV}" mode`);
    console.log(`📡 REST API server: http://localhost:${PORT}`);
    console.log(`🔌 Socket.IO Tasks Monitor: ws://localhost:${PORT}/tasks\n`);
});

// Handle graceful shutdown signals
const shutdown = (signal) => {
    console.log(`\n[Server] Received ${signal}. Shutting down server gracefully...`);
    server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
    });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
