const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const {
    createCustomer,
    listCustomers,
    getCustomer,
    updateCustomer,
    removeCustomer,
    findCustomerByPhone,
    redeemCustomerPoints,
    adjustCustomerPoints,
    getCustomerPointHistory
} = require('../controllers/customer');

router.post('/customer', auth, createCustomer);
router.get('/customers', auth, listCustomers);
router.get('/customer/:id', auth, getCustomer);
router.get('/customer/:id/point-history', auth, getCustomerPointHistory);
router.get('/customer/phone/:phone', auth, findCustomerByPhone);
router.put('/customer/:id', auth, updateCustomer);
router.delete('/customer/:id', auth, role(['Manager', 'Admin', 'Dev']), removeCustomer);

// Point Management
router.post('/customer/:id/redeem', auth, redeemCustomerPoints);
router.post('/customer/:id/adjust-points', auth, role(['Manager', 'Admin', 'Dev']), adjustCustomerPoints);

module.exports = router;
