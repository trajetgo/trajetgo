const jwt = require('jsonwebtoken');
const jwtConfig = require('./jwt.constants');

const generateToken = (userPayload) => {
    // Pass user metadata, secret key, and the expiration options
    return jwt.sign(userPayload, jwtConfig.secret, jwtConfig.options);
};

const verifyToken = (token) => {
    return jwt.verify(token, jwtConfig.secret);
};

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            sub: user.id,
            role: user.role,
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m",
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            sub: user.id,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "30d",
        }
    );
};

const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
    );
};

    module.exports = {
        generateToken,
        generateAccessToken,
        generateRefreshToken,
        verifyToken,
        verifyRefreshToken
    };