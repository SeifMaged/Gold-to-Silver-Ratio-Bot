require('dotenv').config();

const express = require('express');
const { fetchMetalPrices } = require('./services/priceService');
const { calculateRatio, evaluateRatio } = require("./services/signalService");
const { startScheduler } = require('./jobs/scheduler');
const { getState, updateState} = require('./services/stateService');
const { requireAPIKey, limiter} = require('./utils/middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(limiter);

app.get("/prices", async (req, res) => {
    try {
        const { goldPrice, silverPrice } = await fetchMetalPrices();
        
        const ratio = calculateRatio(goldPrice, silverPrice);
        const { silverThresholdBuy, silverThresholdSell } = getState();
        const recommendation = evaluateRatio(ratio, silverThresholdBuy, silverThresholdSell);


    res.json({gold: goldPrice, silver: silverPrice, ratio, recommendation: recommendation});
    
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch metal prices" });
    }
});

app.get("/status", (req, res) => {
    res.json({
        status: "running",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    }
    )
});

app.get("/config", requireAPIKey, (req, res) => {
    const { silverThresholdBuy, silverThresholdSell } = getState();
    res.json({
        buyThreshold: silverThresholdBuy,
        sellThreshold: silverThresholdSell
    });
});

app.post('/config', requireAPIKey, express.json(), (req, res) => {
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

// Handles base route with API info
app.get("/", (req, res) => {
    res.json({ 
        message: "Welcome to the Gold-Silver Ratio Monitor API. Use /prices for current prices and ratio, /status for server status, and /config to view or update thresholds.",
        endpoints : {prices: "/prices", status: "/status", config: "/config (requires x-api-key header)" }
    }
    );
});

// 404 Handler middleware
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" }); 
});

startScheduler();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
