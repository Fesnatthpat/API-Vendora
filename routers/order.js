const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const {
    createOrder,
    listOrders,
    getOrder,
    voidOrder
} = require('../controllers/order');

router.post('/order', auth, createOrder);
router.get('/orders', auth, listOrders);
router.get('/order/:id', auth, getOrder);
router.put('/order/void/:id', auth, admin, voidOrder);

module.exports = router;
