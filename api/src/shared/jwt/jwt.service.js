const jwtUtil = require('./jwt.utils');

class JwtService {
    generateAccessToken = (user) => {
        const accessToken = jwtUtil.generateAccessToken(user);
        return accessToken;
    };

    generateRefreshToken = (user) => {
        const refreshToken = jwtUtil.generateRefreshToken(user);
        return refreshToken;
    };
};

module.exports = new JwtService();