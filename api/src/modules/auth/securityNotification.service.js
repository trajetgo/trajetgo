const emailService = require("../notifications/channels/email/email.service");

class SecurityNotificationService {
    notifyNewDevice = async (user, { ip, userAgent, deviceName, os, browser, date }) => {
        if (!user.email) return;

        await emailService.sendEmail({
            to: user.email,
            template: "new-device-login",
            data: {
                fullName: user.fullName,
                ip: ip || "inconnue",
                userAgent: userAgent || "inconnu",
                deviceName: deviceName || "inconnu",
                os: os || "inconnu",
                browser: browser || "inconnu",
                date: date ?? new Date(),
                securityUrl: `${process.env.AUTH_URL}/login?continue_url=${process.env.MY_URL}/security`,
            },
            subject: "Nouvelle connexion à votre compte Trajet Go",
        });
    };
};

module.exports = new SecurityNotificationService();