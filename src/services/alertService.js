const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_BOT_CHAT_ID = process.env.TELEGRAM_BOT_CHAT_ID;

async function sendTelegramMessage(message) {
    try {
        await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: TELEGRAM_BOT_CHAT_ID,
                text: message
            }
        );
        console.log("Telegram notification sent successfully");
    } catch (error) {
        console.log("Failed to send Telegram notification:", error.message);
    }
}

function shouldSendAlert({
    recommendation,
    lastRecommendation,
    lastAlertSent,
    cooldownMs
}) {
    if (!lastRecommendation){
        return { send : false, reason : "initial_run"};
    }

    if (recommendation === lastRecommendation) {
        return { send : false, reason : "no_change"};
    }

    const now = Date.now();
    const last = lastAlertSent ? new Date(lastALertSent).getTime() : null;

    if (last && now - last < cooldownMs) {
        return { send: false, reason : "cooldown_active"};
    }

    return {send: true};
}

module.exports = { sendTelegramMessage , shouldSendAlert};