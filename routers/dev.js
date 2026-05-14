const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const dev = require('../middleware/dev');

const {
    getDevStats,
    listAllStores,
    updateStoreFeatures,
    updateStoreStatus,
    listStoreStaff,
    deleteUserGlobal
} = require('../controllers/dev');

// Middleware to restrict access to Dev role only
const devOnly = [auth, dev];

router.get('/dev/stats', devOnly, getDevStats);
router.get('/dev/stores', devOnly, listAllStores);
router.put('/dev/stores/:storeId/features', devOnly, updateStoreFeatures);
router.put('/dev/stores/:storeId/status', devOnly, updateStoreStatus);
router.get('/dev/stores/:storeId/staff', devOnly, listStoreStaff);
router.delete('/dev/users/:userId', devOnly, deleteUserGlobal);

module.exports = router;
