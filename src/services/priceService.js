const axios = require('axios');
const { getCache, setCache } = require('../utils/cache');

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function fetchMetalPrice(symbol) {
    const response = await axios.get(
        `https://api.gold-api.com/price/${symbol}`,
        { timeout : 5000 }
    );

    const data = response.data;

    if (!data || typeof data.price !== "number") {
        throw new Error("Invalid API response");
    }

    return data.price;
}

async function fetchMetalPrices() {
    const { cachedData, lastFetchTime } = getCache();
    
    if (cachedData && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
        console.log("Using cached metal prices");
        return cachedData;
    }

    try {
        console.log("Fetching fresh data from gold-api");

        const gold = await fetchMetalPrice("XAU");
        const silver = await fetchMetalPrice("XAG");

        payload = { goldPrice: Number(gold.toFixed(3)), silverPrice: Number(silver.toFixed(3)) };
        setCache(payload);

        return payload;


    } catch (error) {
        console.error("Error fetching metal prices:", error.message);
        
        if (cachedData) {
            console.log("Using stale cached prices due to fetch error");
            return cachedData;
        }
        console.log("Cache failed, Using fallback prices: Gold = $5100, Silver = $85");
        return { goldPrice: 5100, silverPrice: 85 };
    }
}


module.exports = { fetchMetalPrices };