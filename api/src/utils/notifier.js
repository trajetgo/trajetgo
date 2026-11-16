/**
 * Envoi des codes de vérification (SMS / WhatsApp / e-mail).
 * À remplacer par ton fournisseur (Twilio, Infobip, Orange SMS API, WhatsApp Cloud API...).
 */
const sendOtp = async ({ channel, target, code }) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[OTP:${channel}] ${target} -> ${code}`);
        return;
    }
    // TODO: brancher le fournisseur ici
    console.warn(`[OTP] Aucun fournisseur ${channel} configuré, code non envoyé à ${target}.`);
};

module.exports = { sendOtp };
