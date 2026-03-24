const express = require('express');
const router = express.Router();

const { getConfig, updateConfig } = require('../controllers/configController');
const { requireAPIKey } = require('../utils/middleware');

router.get('/config', requireAPIKey, getConfig);
router.post('/config', requireAPIKey, express.json(), updateConfig);

module.exports = router;
