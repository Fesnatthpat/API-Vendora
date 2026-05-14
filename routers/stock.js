const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const {
    listStockMovements,
    adjustStock
} = require('../controllers/stock');

router.get('/stock/movements', auth, listStockMovements);
router.post('/stock/adjust', auth, role(['Cashier', 'Manager', 'Admin', 'Dev']), adjustStock);

module.exports = router;
