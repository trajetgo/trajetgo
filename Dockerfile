# api/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances (y compris dev, car Prisma CLI en a besoin)
RUN npm ci

# Copier le reste du code
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Exposer le port de l'API
EXPOSE 3000

# Script de démarrage qui attend la DB et lance les migrations
# (à créer dans api/start.sh)
CMD ["sh", "-c", "until npx prisma migrate deploy; do echo 'Waiting for DB...'; sleep 2; done && node server.js"]