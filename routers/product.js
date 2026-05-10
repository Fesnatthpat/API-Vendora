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
    removeProduct
} = require('../controllers/product');

// Multer setup for local storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/products')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Routes
router.post('/product', auth, admin, upload.single('image'), createProduct);
router.get('/products', listProducts);
router.get('/product/:id', readProduct);
router.put('/product/:id', auth, admin, upload.single('image'), updateProduct);
router.delete('/product/:id', auth, admin, removeProduct);

module.exports = router;
