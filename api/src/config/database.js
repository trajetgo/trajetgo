const { PrismaClient } = require("../../generated/prisma");
const { PrismaPg } = require('@prisma/adapter-pg');
const env = require("./env");


// Vérifier si DATABASE_URL existe
if (!env.databaseUrl) {
    console.error('❌ DATABASE_URL not found in .env file');
    process.exit(1);
};


// Créer l'adaptateur PostgreSQL
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

// Instancier PrismaClient avec l'adaptateur
const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});


// Test de connexion
async function testConnection() {
    try {
        await prisma.$connect();
        console.log('✅ Database successfully connected');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

testConnection();

module.exports = prisma;