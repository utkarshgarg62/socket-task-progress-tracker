const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Express asyncHandler wrapper for route functions to catch promise rejections
 * and propagate them to the global error middleware automatically.
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Global Express error handling middleware.
 * Intercepts uncaught errors, registers them, and sends structured JSON response.
 */
export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.status || err.statusCode || 500;
    
    // Hide details of 500 errors in production for security
    const responseMessage = statusCode >= 500 && NODE_ENV === 'production'
        ? 'Internal Server Error'
        : (err.message || 'Internal Server Error');

    console.error(`[Error Middleware] Captured error: ${err.message}`, err);

    res.status(statusCode).json({
        success: false,
        error: responseMessage,
        ...(NODE_ENV !== 'production' && { stack: err.stack })
    });
};
