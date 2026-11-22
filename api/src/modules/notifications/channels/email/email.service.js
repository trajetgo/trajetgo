const path = require('path');
const ejs = require('ejs');
const transporter = require("../../../../config/transporter");

class EmailService {
    sendEmail = async ({
        to,
        template,
        data,
        subject,
        html
    }) => {
        let emailSubject = subject;
        let emailHtml = html;

        // Si un template EJS est spécifié, on le compile dynamiquement
        if (template) {
            // Définissez le chemin vers votre dossier templates
            const templatePath = path.join(__dirname, `../../templates/email/${template}.ejs`);

            // Rendu du fichier EJS avec les données fournies
            emailHtml = await ejs.renderFile(templatePath, data);

            // Sujets par défaut selon le template (ou personnalisables)
            if (!emailSubject) {
                switch (template) {
                    case 'verify-email':
                        emailSubject = "Vérification de votre adresse e-mail - Trajet Go";
                        break;
                    case 'email-verification':
                        emailSubject = "Vérification de votre adresse e-mail - Trajet Go";
                        break;
                    case 'new-device-login':
                        emailSubject = "Nouvelle connexion à votre compte Trajet Go";
                        break;
                    default:
                        emailSubject = "Notification - Trajet Go";
                }
            }
        }

        const mailOptions = {
            from: `"TrajetGo" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to,
            subject: emailSubject,
            html: emailHtml,
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    }
};

module.exports = new EmailService();