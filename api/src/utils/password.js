const argon2 = require('argon2');
const bcrypt = require('bcryptjs');

// Paramètres Argon2id (minimum recommandé par l'OWASP)
const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 19456, // ~19 Mio
    timeCost: 2,
    parallelism: 1,
};

const CURRENT_ALGORITHM = 'argon2id';

const hashPassword = (plain) => argon2.hash(plain, ARGON2_OPTIONS);

/**
 * Vérifie un mot de passe selon l'algorithme stocké dans PasswordCredential.
 * "bcrypt" sert aux comptes importés des anciennes apps (AdsCity, etc.).
 */
const verifyPassword = async ({ hash, algorithm }, plain) => {
    try {
        switch (algorithm) {
            case 'argon2id':
                return await argon2.verify(hash, plain);
            case 'bcrypt':
                return await bcrypt.compare(plain, hash);
            default:
                return false;
        }
    } catch {
        return false;
    }
};

const credentialNeedsRehash = (credential) =>
    credential.needsRehash || credential.algorithm !== CURRENT_ALGORITHM;

// Vérification factice : égalise le temps de réponse quand le compte n'existe pas
let dummyHashPromise;
const dummyVerify = async (plain) => {
    dummyHashPromise = dummyHashPromise || hashPassword('xenady-dummy-password');
    await argon2.verify(await dummyHashPromise, plain).catch(() => false);
};

module.exports = {
    CURRENT_ALGORITHM,
    hashPassword,
    verifyPassword,
    credentialNeedsRehash,
    dummyVerify,
};
