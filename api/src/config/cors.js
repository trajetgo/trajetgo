const parseAllowedOrigins = () => {
    const origins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003';
    return origins.split(',').map(origin => origin.trim());
};

const corsOptions = {
    origin: function (origin, callback) {
        // En développement/Postman (requêtes sans header Origin)
        if (!origin) {
            if (process.env.NODE_ENV === 'development') {
                return callback(null, true);
            }
            return callback(null, false);
        }

        const allowedOrigins = parseAllowedOrigins();

        // Si l'origine est autorisée OU qu'on est en dev
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
            // IMPORTANT : Renvoyer l'origine exacte (origin) plutôt que `true` 
            // pour éviter le joker `*` incompatible avec `credentials: true`
            callback(null, origin);
        } else {
            console.warn(`❌ CORS blocked origin: ${origin}`);
            console.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`);
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'x-csrf-token',
        'Accept',
        'Origin',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400, // 24 heures
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

module.exports = corsOptions;