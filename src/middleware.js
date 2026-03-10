const rateLimit = require('express-rate-limit');

function requireAPIKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (!!apiKey || apiKey !== process.env.CONFIG_API_KEY) {
        return res.status(401).json({ error: "Unauthorized." });
    }

    next();
}

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,
    message: { error: "Too many requests, please try again later." }
});

module.exports = { requireAPIKey, limiter };