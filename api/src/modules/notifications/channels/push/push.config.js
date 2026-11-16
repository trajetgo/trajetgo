
const webPush = require("web-push");

const {
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
} = process.env;

if (
    !VAPID_SUBJECT ||
    !VAPID_PUBLIC_KEY ||
    !VAPID_PRIVATE_KEY
) {
    throw new Error(
        "Web Push configuration is incomplete. Check VAPID environment variables."
    );
}

webPush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

module.exports = webPush;