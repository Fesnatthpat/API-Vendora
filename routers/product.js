const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Middleware
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Controller functions
const {
    createProduct,
    listProducts,
    readProduct,
    updateProduct,
    removeProduct,
    getLowStockProducts
} = require('../controllers/product');

// Multer setup for memory storage (for Supabase upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post('/product', auth, role(['Cashier', 'Manager', 'Admin', 'Dev']), upload.single('image'), createProduct);
router.get('/products', auth, listProducts);
router.get('/products/low-stock', auth, getLowStockProducts);
router.get('/product/:id', auth, readProduct);
router.put('/product/:id', auth, role(['Cashier', 'Manager', 'Admin', 'Dev']), upload.single('image'), updateProduct);
router.delete('/product/:id', auth, role(['Cashier', 'Manager', 'Admin', 'Dev']), removeProduct);

module.exports = router;
