const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const {
    listStockMovements,
    adjustStock
} = require('../controllers/stock');

router.get('/stock/movements', auth, listStockMovements);
router.post('/stock/adjust', auth, admin, adjustStock);

module.exports = router;
