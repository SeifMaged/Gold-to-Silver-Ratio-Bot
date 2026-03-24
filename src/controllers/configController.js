const { getState, updateState } = require('../services/stateService');

function getConfig(req, res) {
    const { silverThresholdBuy, silverThresholdSell } = getState();

    res.json({
        buyThreshold: silverThresholdBuy,
        sellThreshold: silverThresholdSell
    });
}

function updateConfig(req, res) {
    const { buyThreshold, sellThreshold } = req.body || {};

    if (buyThreshold === undefined || sellThreshold === undefined) {
        return res.status(400).json({
            error: "Missing buyThreshold or sellThreshold"
        });
    }

    if (
        typeof buyThreshold !== "number" ||
        typeof sellThreshold !== "number" ||
        buyThreshold <= sellThreshold ||
        buyThreshold <= 0 ||
        sellThreshold <= 0
    ) {
        return res.status(400).json({
            error: "Invalid threshold values"
        });
    }

    updateState({
        silverThresholdBuy: buyThreshold,
        silverThresholdSell: sellThreshold
    });

    res.json({
        message: "Configuration updated successfully",
        buyThreshold,
        sellThreshold
    });
}

module.exports = { getConfig, updateConfig };
