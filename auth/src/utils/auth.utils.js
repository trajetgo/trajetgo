export const REGISTER_STEPS = [
    {
        key: "identity",
        title: "Identité",
        description: "Vos informations personnelles",
        fields: ["firstName", "lastName"],
    },
    {
        key: "contact",
        title: "Contact",
        description: "Votre numéro de téléphone",
        fields: ["email", "phone"],
    },
    {
        key: "security",
        title: "Sécurité",
        description: "Mot de passe et conditions",
        fields: ["password", "agree"],
    },
];

export const REGISTER_SUCCESS_STORAGE_KEY = "tg:register-success";
export const FORGOT_PASSWORD_IDENTIFIER_STORAGE_KEY = "tg:forgot-password-identifier";

export const PASSWORD_MIN_LENGTH = 8;