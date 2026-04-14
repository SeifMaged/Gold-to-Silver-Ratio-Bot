require('dotenv').config();

const express = require('express');
const { limiter } = require('./utils/middleware');
const priceRoutes = require('./routes/priceRoutes');
const configRoutes = require('./routes/configRoutes');
const { startScheduler } = require('./jobs/scheduler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(limiter);

// Routes
app.use('/prices', priceRoutes);
app.use('/config', configRoutes);

// Status route (can move later)
app.get("/status", (req, res) => {
    res.json({
        status: "running",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "Gold-Silver Ratio Monitor API",
        endpoints: {
            prices: "/prices",
            status: "/status",
            config: "/config"
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

startScheduler();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
