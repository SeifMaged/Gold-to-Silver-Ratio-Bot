const { fetchMetalPrices } = require('./priceService');
const { calculateRatio, evaluateRatio } = require("./ratioService");
const { sendTelegramMessage } = require('./telegramService');
const { getState, updateState } = require('./state');

async function monitorPrices() {
    try {
        const { goldPrice, silverPrice } = await fetchMetalPrices();
        const ratio = calculateRatio(goldPrice, silverPrice);
        const recommendation = evaluateRatio(ratio, state.silverThresholdBuy, state.silverThresholdSell);
        
        state = getState(); // Refresh state to get latest values
        if (!state.lastRecommendation){
            updateState({ lastRecommendation: recommendation });
        }
        if (recommendation != state.lastRecommendation) {
            console.log("Recommendation Changed, Sending Alert ", recommendation);
            await sendTelegramMessage(`⚠️ Recommendation Changed: ${recommendation}\n\nGold Price = $${goldPrice}\nSilver Price = $${silverPrice}\nRatio = ${ratio}`);
            updateState({ lastRecommendation: recommendation });
        } else {
            console.log("No change in recommendation: ", recommendation);
        }
    } catch (error) {
        console.error("Error monitoring prices:", error.message);
    }

    // Daily Summary at 10am UTC
    const now = new Date();
    const lastSent = state.lastDailySent ? new Date(state.lastDailySent) : null;
    const today10UTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 10, 0, 0));


    if (now >= today10UTC && (!lastSent || lastSent < today10UTC)) {
        try {
            const { goldPrice, silverPrice } = await fetchMetalPrices();
            const ratio = calculateRatio(goldPrice, silverPrice);
            const recommendation = evaluateRatio(ratio, state.silverThresholdBuy, state.silverThresholdSell);
            await sendTelegramMessage(`Daily Summary:\n\nGold Price = $${goldPrice}\nSilver Price = $${silverPrice}\nRatio = ${ratio}\nRecommendation: ${recommendation}`);
            updateState({ lastDailySent: now.toISOString() });
        } catch (error) {
            console.error("Error sending daily summary:", error.message);
        }
    }

}

function startScheduler() {
    console.log("Starting metal price monitoring scheduler...");
    monitorPrices(); // Initial run

    setInterval(monitorPrices, 10 * 60 * 1000); // Every 10 minutes
}

module.exports = { startScheduler };