const ApiError = require("../../../utils/ApiError");

const aggregatorProvider = require('./aggregator.provider'); 
const orangeProvider = require('./orange.provider'); 
const mtnProvider = require('./mtn.provider'); 
const moovProvider = require('./moov.provider'); 
const waveProvider = require('./wave.provider');

const providers = {
    AGGREGATOR: aggregatorProvider,
    ORANGE: orangeProvider,
    MTN: mtnProvider,
    MOOV: moovProvider,
    WAVE: waveProvider
};

const getProvider = (providerName) => {
    if (!providerName) {
        throw new ApiError(
            400,
            'Le fournisseur de paiement est requis'
        );
    }

    const normalizedName = String(providerName).trim().toUpperCase();

    const provider = providers[normalizedName];

    if (!provider) {
        throw new ApiError(
            400,
            `Fournisseur de paiement non supporté: ${providerName}`
        );
    }

    return provider;
};

const hasProvider = (providerName) => {
    if (!providerName) {
        return false;
    }

    const normalizedName = String(providerName).trim().toUpperCase();

    return Boolean(providers[normalizedName]);
};

module.exports = {
    getProvider,
    hasProvider
}