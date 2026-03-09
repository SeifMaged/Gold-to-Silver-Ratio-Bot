require('dotenv').config();

const express = require('express');
const { fetchMetalPrices } = require('./priceService');
const { calculateRatio, evaluateRatio } = require("./ratioService");
const { startScheduler } = require('./scheduler');
const { loadState } = require('./stateManager');

let state = loadState();

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
})

// 404 Handler middleware
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" }); 
});

startScheduler();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
