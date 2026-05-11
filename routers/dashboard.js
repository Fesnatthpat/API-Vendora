const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const {
    getSummary,
    getTopProducts,
    getSalesChart
} = require('../controllers/dashboard');

router.get('/dashboard/summary', auth, admin, getSummary);
router.get('/dashboard/top-products', auth, admin, getTopProducts);
router.get('/dashboard/sales-chart', auth, admin, getSalesChart);

module.exports = router;