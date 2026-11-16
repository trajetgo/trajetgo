const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const router = require('./src/app');
const corsOptions = require('./src/config/cors');
const { scheduleGenerateTrips } = require('./src/cron/generateTrips');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost' 
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';


// ========================
// CONFIGURATION ENVIRONNEMENT
// ========================

const DOMAIN = isProduction ? '.adscity.net' : 'localhost';
const PROTOCOL = isProduction ? 'https' : 'http';

console.log(`🌍 Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
console.log(`🌐 Domain: ${DOMAIN}`);
console.log(`🔐 Protocol: ${PROTOCOL}`);

// ========================
// MIDDLEWARE DE SÉCURITÉ (Production seulement)
// ========================

if (isProduction) {
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
        crossOriginEmbedderPolicy: false
    }));

    app.use(compression());

    // Logging en production
    const accessLogStream = fs.createWriteStream(
        path.join(__dirname, 'access.log'),
        { flags: 'a' }
    );
    app.use(morgan('combined', { stream: accessLogStream }));
} else {
    // Logging détaillé en développement
    app.use(morgan('dev'));
}

if (!isProduction) {
    app.use((req, res, next) => {
        console.log('=== REQUEST ===');
        console.log('Method:', req.method);
        console.log('URL:', req.url);
        console.log('Origin:', req.headers.origin);
        console.log('Host:', req.headers.host);
        console.log('================');
        next();
    });
}


// ========================
// MIDDLEWARE DE BASE
// ========================
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Trust proxy pour les cookies cross-domain (Production)
if (isProduction) {
    app.set('trust proxy', 1);
}



// API routes
app.use('/api', router);

app.set('trust proxy', 1);


scheduleGenerateTrips();

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${APP_BASE_URL}:${PORT}`);
    console.log(`📦 Environment: ${NODE_ENV}`);
    console.log(`🔌 WebSocket server running on ws ${APP_BASE_URL}:${PORT}`);
    console.log(`📚 Documentation running on port ${APP_BASE_URL}:${PORT}/api/docs`);
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
    console.log('\n⚠️  Arrêt du serveur en cours...');
    server.close(() => {
        console.log('✅ Serveur arrêté proprement');
        process.exit(0);
    });
});

process.on('SIGTERM', async () => {
    console.log('\n⚠️  Arrêt du serveur (SIGTERM)...');
    await redisClient.disconnect();
    server.close(() => {
        console.log('✅ Serveur arrêté proprement');
        process.exit(0);
    });
});