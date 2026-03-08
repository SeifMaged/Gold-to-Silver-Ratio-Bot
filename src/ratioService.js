function calculateRatio(gold, silver) {
    if (!gold || !silver || typeof gold !== "number" || typeof silver !== "number" || gold <= 0 || silver <= 0) {
        throw new Error("Invalid Metal Prices");
    }

    return Number((gold / silver).toFixed(3));
}

function evaluateRatio(ratio, buyThreshold, sellThreshold) {
    if (ratio >= buyThreshold) return "BUY SILVER";
    if (ratio <= sellThreshold) return "SELL SILVER";
    return "HOLD";
}

module.exports = { calculateRatio, evaluateRatio };