const fs = require("fs");
const path = require("path");

const stateFilePath = path.join(__dirname, "state.json");

function loadState() {
    if (!fs.existsSync(stateFilePath)) {
        return getDefaultState();
    }

    try {
        const rawData = fs.readFileSync(stateFilePath, "utf8");

        if (!rawData.trim()) {
            return getDefaultState();
        }

        return JSON.parse(rawData);

    } catch (error) {
        console.error("State File Error, Resetting state. Error:", error.message);
        return getDefaultState();
    }
    
}

function getDefaultState() {
    return {
            lastRecommendation : null,
            lastDailySent : null,
            silverThresholdBuy : 70,
            silverThresholdSell : 50,
            lastAlertSent : null
        };
}

function saveState(state) {
    fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2));
}

module.exports = { loadState, saveState };