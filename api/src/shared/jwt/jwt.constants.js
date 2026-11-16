const env = require("../../config/env");

module.exports = {
    secret: env.jwt.accessSecret,
    options: {
        expiresIn: env.jwt.accessExpires || '1h',
        algorithm: 'HS256'
    }
};