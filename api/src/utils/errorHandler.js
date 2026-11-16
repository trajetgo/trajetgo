exports.errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Erreur serveur interne';

    // Erreurs de validation (express-validator)
    if (err.array && typeof err.array === 'function') {
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors: err.array(),
        });
    }

    // Erreurs JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token invalide',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expiré',
        });
    }

    // Prisma errors
    if (err.code === 'P2002') {
        statusCode = 400;
        message = `La valeur '${err.meta?.target?.join(', ')}' existe déjà`;
    }

    if (err.code === 'P2025') {
        statusCode = 404;
        message = 'Ressource non trouvée';
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token invalide';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expiré';
    }

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 400;
        message = 'Fichier trop volumineux (max 5MB)';
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

exports.notFound = (req, res, next) => {
    const error = new Error(`Route non trouvée - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};