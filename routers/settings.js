const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const {
    getSettings,
    updateSettings
} = require('../controllers/settings');

router.get('/settings', auth, getSettings);
router.put('/settings', auth, admin, updateSettings);
router.post('/settings', auth, admin, updateSettings);

module.exports = router;
