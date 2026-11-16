
require("dotenv").config();

const esmsProvider = require(
    "../modules/notifications/providers/esms.provider"
);

async function testSms() {
    try {
        const result = await esmsProvider.send({
            to: "+2250700000001",
            text: "Trajet Go : votre code de verification est 123456."
        });

        console.log("Résultat eSMS :", result);
    } catch (error) {
        console.error("Erreur SMS :", error.message);
    }
}

testSms();
