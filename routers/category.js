const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const {
    createCategory,
    listCategories,
    updateCategory,
    removeCategory
} = require('../controllers/category');

router.post('/category', auth, role(['Cashier', 'Manager', 'Admin', 'Dev']), createCategory);
router.get('/categories', auth, listCategories);
router.put('/category/:id', auth, role(['Cashier', 'Manager', 'Admin', 'Dev']), updateCategory);
router.delete('/category/:id', auth, role(['Cashier', 'Manager', 'Admin', 'Dev']), removeCategory);

module.exports = router;
