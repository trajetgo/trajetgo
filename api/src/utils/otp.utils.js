const crypto = require("node:crypto");

const generateOtp = () => {
    return crypto
        .randomInt(0, 1_000_000)
        .toString()
        .padStart(6, "0");
};

const hashOtp = (otp) => {
    return crypto
        .createHash("sha256")
        .update(String(otp))
        .digest("hex");
};

/**
 * Compare un OTP en clair au hash stocké.
 * Utilise timingSafeEqual pour éviter les attaques temporelles.
 */
const compareOtp = (otp, hash) => {
    if (typeof otp !== "string" || typeof hash !== "string") {
        return false;
    }

    const candidate = Buffer.from(hashOtp(otp), "hex");
    const expected = Buffer.from(hash, "hex");

    // timingSafeEqual exige des buffers de même longueur.
    if (candidate.length !== expected.length) {
        return false;
    }

    return crypto.timingSafeEqual(candidate, expected);
};

module.exports = {
    compareOtp,
    generateOtp,
    hashOtp,
};