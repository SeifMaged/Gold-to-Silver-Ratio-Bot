const express = require('express');
const router = express.Router();

const { getConfig, updateConfig } = require('../controllers/configController');
const { requireAPIKey } = require('../utils/middleware');

router.get('/', requireAPIKey, getConfig);
router.post('/', requireAPIKey, express.json(), updateConfig);

module.exports = router;
