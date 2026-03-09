require('dotenv').config();

const express = require('express');
const { fetchMetalPrices } = require('./priceService');
const { calculateRatio, evaluateRatio } = require("./ratioService");
const { startScheduler } = require('./scheduler');
const { getState, updateState} = require('./state');

let state = getState();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/prices", async (req, res) => {
    try {
        const { goldPrice, silverPrice } = await fetchMetalPrices();
        
        const ratio = calculateRatio(goldPrice, silverPrice);
        const recommendation = evaluateRatio(ratio, state.silverThresholdBuy, state.silverThresholdSell);


    res.json({gold: goldPrice, silver: silverPrice, ratio, recommendation: recommendation});
    
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch metal prices" });
    }
});

app.get("/status", (req, res) => {
    res.json({
        status: "running",
        timestamp: new Date().toISOString()
    }
    )
});

app.get("/config", (req, res) => {
    res.json({
        buyThreshold: state.silverThresholdBuy,
        sellThreshold: state.silverThresholdSell
    });
});

app.post('/config', express.json(), (req, res) => {
    const { buyThreshold, sellThreshold } = req.body || {};

    if (buyThreshold === undefined || sellThreshold === undefined) {
        return res.status(400).json({ error: "Missing buyThreshold or sellThreshold in request body" });
    }

    if (
        typeof buyThreshold !== "number" ||
        typeof sellThreshold !== "number" ||
        buyThreshold <= sellThreshold || 
        buyThreshold <= 0 ||
        sellThreshold <= 0
    ) {
        return res.status(400).json({ error: "Invalid threshold values, please ensure buy threshold is greater than sell threshold and both are positive numbers" });
    }

    // Update the state with the new thresholds
    updateState({ silverThresholdBuy: buyThreshold, silverThresholdSell: sellThreshold });

    res.json({ 
        message: "Configuration updated successfully",
        buyThreshold,
        sellThreshold
     });
});


// 404 Handler middleware
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" }); 
});

startScheduler();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
