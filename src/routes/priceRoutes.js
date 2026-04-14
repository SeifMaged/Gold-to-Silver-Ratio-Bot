const express = require("express");
const router = express.Router();

const { getPricesHandler } = require("../controllers/priceController");

router.get('/', getPricesHandler);

module.exports = router;