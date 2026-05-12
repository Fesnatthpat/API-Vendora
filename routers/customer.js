const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
    createCustomer,
    listCustomers,
    getCustomer,
    updateCustomer,
    removeCustomer,
    findCustomerByPhone,
    redeemCustomerPoints,
    adjustCustomerPoints
} = require('../controllers/customer');

router.post('/customer', auth, createCustomer);
router.get('/customers', auth, listCustomers);
router.get('/customer/:id', auth, getCustomer);
router.get('/customer/phone/:phone', auth, findCustomerByPhone);
router.put('/customer/:id', auth, updateCustomer);
router.delete('/customer/:id', auth, removeCustomer);

// Point Management
router.post('/customer/:id/redeem', auth, redeemCustomerPoints);
router.post('/customer/:id/adjust-points', auth, adjustCustomerPoints);

module.exports = router;
