const { fetchMetalPrices } = require('./priceService');
const { calculateRatio, evaluateRatio } = require("./ratioService");
const { sendTelegramMessage } = require('./telegramService');
const { getState, updateState } = require('./state');

async function monitorPrices() {
    const COOLDOWN = 4 * 60 * 60 * 1000; // 4 hour cooldown
    const state = getState(); // Refresh state to get latest values
    const lastAlertSent = state.lastAlertSent ? new Date(state.lastAlertSent) : null;
    const cooldownPassed = !lastAlertSent || Date.now() - lastAlertSent >= COOLDOWN;


    try {
        const { goldPrice, silverPrice } = await fetchMetalPrices();
        const ratio = calculateRatio(goldPrice, silverPrice);
        const recommendation = evaluateRatio(ratio, state.silverThresholdBuy, state.silverThresholdSell);
        
        
        if (!state.lastRecommendation){
            // First run scenario, just save the recommendation without sending alert
            updateState({ lastRecommendation: recommendation });
            console.log("No previous recommendation available, loaded current recommendation: ", recommendation);
        } else if (recommendation !== state.lastRecommendation) {
            if (cooldownPassed) {
                console.log("Recommendation Changed, Sending Alert ", recommendation);
                await sendTelegramMessage(`⚠️ Recommendation Changed: ${recommendation}\n\nGold Price = $${goldPrice}\nSilver Price = $${silverPrice}\nRatio = ${ratio}`);
                updateState({ lastRecommendation: recommendation , lastAlertSent : new Date().toISOString() });
            } else{
                console.log("Recommendation changed but cooldown active, will alert when cooldown expires")
            }
            
        } else {
            console.log("No change in recommendation: ", recommendation);
        }
    } catch (error) {
        console.error("Error monitoring prices:", error.message);
    }

    await dailySummary(); // Check for daily summary

}

async function dailySummary() {
    // Daily Summary at 10am UTC
    const state = getState(); // Refresh state to get latest values
    
    const now = new Date();
    const lastSent = state.lastDailySent ? new Date(state.lastDailySent) : null;
    const today10UTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 10, 0, 0));


    if (now >= today10UTC && (!lastSent || lastSent < today10UTC)) {
        try {
            const { goldPrice, silverPrice } = await fetchMetalPrices();
            const ratio = calculateRatio(goldPrice, silverPrice);
            const recommendation = evaluateRatio(
                ratio, 
                state.silverThresholdBuy, 
                state.silverThresholdSell, 
                state.lastRecommendation
            );
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