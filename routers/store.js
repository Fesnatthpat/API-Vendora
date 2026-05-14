const express = require('express');
const router = express.Router();
const { createStore, getMyStore, updateStore } = require('../controllers/store');
const auth = require('../middleware/auth');

router.post('/stores', auth, createStore);
router.get('/stores/me', auth, getMyStore);
router.put('/stores', auth, updateStore); // Using /stores instead of /stores/:id as user only has one store

module.exports = router;
