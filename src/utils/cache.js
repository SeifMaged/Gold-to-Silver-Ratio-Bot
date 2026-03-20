const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, process.env.CACHE_FILE || "cache.json");

function loadCacheFromFile() {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const data = fs.readFileSync(CACHE_FILE, "utf-8");
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Failed to load cache from file:", error);
    }
    // return empty data in case of failure or if file doesn't exist
    return { cachedData: null, lastFetchTime: null };
}

function saveCacheToFile(data) {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Failed to save data to cache:", error);
    }
}

function getCache() {
    return loadCacheFromFile();
}

function setCache(data) {
    saveCacheToFile({ cachedData: data, lastFetchTime: Date.now() });
}

module.exports = { getCache, setCache };
