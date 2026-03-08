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

module.exports = { sendTelegramMessage };