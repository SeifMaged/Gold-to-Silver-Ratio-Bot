const { fetchMetalPrices } = require('./priceService');
const { calculateRatio, evaluateRatio } = require("./ratioService");
const { sendTelegramMessage } = require('./telegramService');

let prevRecommendation = "HOLD"; // DEFAULT HOLD ON RESTART

async function monitorPrices() {
    try {
        const { goldPrice, silverPrice } = await fetchMetalPrices();
        const ratio = calculateRatio(goldPrice, silverPrice);
        const recommendation = evaluateRatio(ratio, process.env.SILVER_THRESHOLD_BUY, process.env.SILVER_THRESHOLD_SELL);
        
        if (recommendation != prevRecommendation) {
            console.log("Recommendation Changed: ", recommendation);
            if (recommendation === "BUY SILVER") {
                await sendTelegramMessage(`BUY SILVER: Gold Price = $${goldPrice}, Silver Price = $${silverPrice}, Ratio = ${ratio}`);
            }
            prevRecommendation = recommendation;
            // NOTIFY
        } else {
            console.log("No change in recommendation: ", recommendation);
            await sendTelegramMessage(`Sanity Check`);
        }
    } catch (error) {
        console.error("Error monitoring prices:", error.message);
    }

}

function startScheduler() {
    console.log("Starting metal price monitoring scheduler...");
    monitorPrices(); // Initial run

    setInterval(monitorPrices, 10 * 60 * 1000); // Every 10 minutes
}

module.exports = { startScheduler };