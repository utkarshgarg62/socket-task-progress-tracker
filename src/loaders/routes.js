import apiRoutes from '../api/index.js';

/**
 * Register all API endpoints on the Express application.
 * Mounts routes under root '/' and also '/api' to provide flexibility.
 * 
 * @param {express.Application} app - The Express application instance.
 */
export const registerRoutes = (app) => {
    app.use('/', apiRoutes);
    app.use('/api', apiRoutes);
};
