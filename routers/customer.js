const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
    createCustomer,
    listCustomers,
    getCustomer,
    updateCustomer,
    removeCustomer,
    findCustomerByPhone
} = require('../controllers/customer');

router.post('/customer', auth, createCustomer);
router.get('/customers', auth, listCustomers);
router.get('/customer/:id', auth, getCustomer);
router.get('/customer/phone/:phone', auth, findCustomerByPhone);
router.put('/customer/:id', auth, updateCustomer);
router.delete('/customer/:id', auth, removeCustomer);

module.exports = router;
