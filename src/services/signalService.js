function calculateRatio(gold, silver) {
    if (!gold || !silver || typeof gold !== "number" || typeof silver !== "number" || gold <= 0 || silver <= 0) {
        throw new Error("Invalid Metal Prices");
    }

    return Number((gold / silver).toFixed(3));
}

function generateSignal(ratio, buyThreshold, sellThreshold, lastRecommendation) {
    const HYSTERESIS = 2; // buffer

    if (lastRecommendation === "BUY SILVER") {
        if (ratio <= buyThreshold - HYSTERESIS) return "HOLD";
        return "BUY SILVER";
    }
    if (lastRecommendation === "SELL SILVER") {
        if (ratio >= sellThreshold + HYSTERESIS) return "HOLD";
        return "SELL SILVER";
    }
    
    
    if (ratio >= buyThreshold) return "BUY SILVER";
    if (ratio <= sellThreshold) return "SELL SILVER";
    return "HOLD";
}

module.exports = { calculateRatio, generateSignal };