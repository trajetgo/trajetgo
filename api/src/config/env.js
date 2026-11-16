require("dotenv").config();

const requiredEnvVars = [
    "PORT",
    "NODE_ENV",
    "DATABASE_URL",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
];

requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`❌ Missing required environment variable: ${key}`);
    }
});

module.exports = {
    port: Number(process.env.PORT),

    nodeEnv: process.env.NODE_ENV,

    databaseUrl: process.env.DATABASE_URL,

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpires: process.env.JWT_ACCESS_EXPIRES || "15m",
        refreshExpires: process.env.JWT_REFRESH_EXPIRES || "30d",
    },

    cookieSecret: process.env.COOKIE_SECRET,

    clientUrl: process.env.CLIENT_URL,

    adminUrl: process.env.ADMIN_URL,
};