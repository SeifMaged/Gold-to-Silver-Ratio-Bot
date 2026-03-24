const { getPrices } = require('../services/priceService');
const { calculateRatio, generateSignal } = require('../services/signalService');
const { getState } = require('../services/stateService');

async function getPricesHandler(req, res) {
    try {
        const { goldPrice, silverPrice } = await getPrices();

        const ratio = calculateRatio(goldPrice, silverPrice);

        const { silverThresholdBuy, silverThresholdSell, lastRecommendation } = getState();

        const recommendation = generateSignal(
            ratio,
            silverThresholdBuy,
            silverThresholdSell,
            lastRecommendation
        );

        res.json({
            gold: goldPrice,
            silver: silverPrice,
            ratio,
            recommendation
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch metal prices" });
    }
}

module.exports = { getPricesHandler };
