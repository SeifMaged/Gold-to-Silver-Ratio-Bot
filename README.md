# Gold to Silver Ratio Monitoring Service

A backend financial monitoring microservice built with Node.js and Express that tracks the Gold/Silver ratio, and sends real-time Telegram alerts when configurable thresholds are crossed.

## Deployed on Render:

🔗 **Live API:** https://gsr-monitor.onrender.com

## Features

- Fetches real-time gold and silver prices from a public metals API
- Computes Gold/Silver ratio
- Sends Telegram alerts when recommendation changes
- Sends daily summary updates regardless of changes
- Persists application state across restarts
- Configurable thresholds through REST endpoint
- Caching to reduce unnecessary API calls

---

### Design Decisions

- **File-based state perisistence** for simplicity.
- **Environment Variables** for secret management.

---

## Signal Logic

The system computes:

ratio = gold_price / silver_price

Signals:

- If ratio >= buyThreshold -> BUY SILVER
- If ratio >= sellThreshold -> SELL SILVER

Thresholds are configurable at runtime.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/SeifMaged/Gold-to-Silver-Ratio-Bot.git
cd Gold-to-Silver-Ratio-Bot
```

### 2. Install dependencies

```bash
npm install
```
### 3. Create environment file

Create .env in the root directory with variables:

```ini
API_KEY=Generate_any_API_key // Required for threshold configuration
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
CACHE_FILE=your_cache_file_path // Optional
```
To run locally:

```bash
npm start
```

Server runs on:
```arduino
http://localhost:3000
```