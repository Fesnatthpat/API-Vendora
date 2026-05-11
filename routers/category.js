const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
    createCategory,
    listCategories,
    updateCategory,
    removeCategory
} = require('../controllers/category');

router.post('/category', auth, admin, createCategory);
router.get('/categories', listCategories);
router.put('/category/:id', auth, admin, updateCategory);
router.delete('/category/:id', auth, admin, removeCategory);

module.exports = router;
