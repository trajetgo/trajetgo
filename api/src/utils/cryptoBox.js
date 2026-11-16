const crypto = require('crypto');

/**
 * Chiffrement AES-256-GCM pour les secrets stockés en base
 * (secrets des clients OIDC, clés privées de signature).
 * DATA_ENCRYPTION_KEY : 32 octets en base64.  Générer : openssl rand -base64 32
 */
const getKey = () => {
    const b64 = process.env.DATA_ENCRYPTION_KEY;

    if (!b64) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('DATA_ENCRYPTION_KEY est obligatoire en production.');
        }
        return crypto.createHash('sha256').update('dev-only-data-key').digest();
    }

    const key = Buffer.from(b64, 'base64');
    if (key.length !== 32) {
        throw new Error('DATA_ENCRYPTION_KEY doit faire 32 octets (base64).');
    }
    return key;
};

const encrypt = (plain) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
    const data = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return ['v1', iv, tag, data].map((p) => (typeof p === 'string' ? p : p.toString('base64url'))).join('.');
};

const decrypt = (box) => {
    const [version, iv, tag, data] = String(box).split('.');
    if (version !== 'v1') throw new Error('Format de secret chiffré inconnu.');
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        getKey(),
        Buffer.from(iv, 'base64url')
    );
    decipher.setAuthTag(Buffer.from(tag, 'base64url'));
    return Buffer.concat([
        decipher.update(Buffer.from(data, 'base64url')),
        decipher.final(),
    ]).toString('utf8');
};

module.exports = { encrypt, decrypt };