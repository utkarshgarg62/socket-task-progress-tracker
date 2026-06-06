import dotenv from 'dotenv';
dotenv.config();

const configs = {
    development: {
        PORT: process.env.PORT || 5000,
        CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
    },
    production: {
        PORT: process.env.PORT || 5000,
        CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
    }
};

export default configs;
