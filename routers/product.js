const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

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
router.post('/product', auth, admin, upload.single('image'), createProduct);
router.get('/products', listProducts);
router.get('/products/low-stock', auth, getLowStockProducts);
router.get('/product/:id', readProduct);
router.put('/product/:id', auth, admin, upload.single('image'), updateProduct);
router.delete('/product/:id', auth, admin, removeProduct);

module.exports = router;
