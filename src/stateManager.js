const fs = require("fs");
const path = require("path");

const stateFilePath = path.join(__dirname, "state.json");

function loadState() {
    if (!fs.existsSync(stateFilePath)) {
        return {
            lastRecommendation : null,
            lastDailySent : null,
            buyThreshold : 70,
            sellThreshold : 50
        }
    }

    const rawData = fs.readFileSync(stateFilePath);
    return JSON.parse(rawData);
}

function saveState(state) {
    fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2));
}

module.exports = { loadState, saveState };