const prisma = require('../prisma/prisma');
const fs = require('fs');
const path = require('path');

exports.createProduct = async (req, res) => {
    try {
        const { name, category, price, cost, stock, minStockThreshold, barcode, sku, categoryId } = req.body;
        let imageUrl = null;

        if (req.file) {
            // Store relative path for database
            imageUrl = req.file.path.replace(/\\/g, '/');
        }

        const product = await prisma.product.create({
            data: {
                name,
                category,
                price: parseFloat(price),
                cost: parseFloat(cost),
                stock: parseInt(stock) || 0,
                minStockThreshold: parseInt(minStockThreshold) || 5,
                barcode,
                sku,
                image: imageUrl,
                categoryId: categoryId ? parseInt(categoryId) : null
            }
        });

        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        // Delete uploaded file if database operation fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.listProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                categoryRelation: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.readProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                categoryRelation: true
            }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, cost, stock, minStockThreshold, barcode, sku, categoryId } = req.body;
        
        const existingProduct = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingProduct) {
            // Delete newly uploaded file if product not found
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Product not found' });
        }

        let imageUrl = existingProduct.image;

        if (req.file) {
            // Delete old image file if it exists
            if (existingProduct.image && fs.existsSync(existingProduct.image)) {
                fs.unlinkSync(existingProduct.image);
            }
            imageUrl = req.file.path.replace(/\\/g, '/');
        }

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name,
                category,
                price: price ? parseFloat(price) : undefined,
                cost: cost ? parseFloat(cost) : undefined,
                stock: stock ? parseInt(stock) : undefined,
                minStockThreshold: minStockThreshold ? parseInt(minStockThreshold) : undefined,
                barcode,
                sku,
                image: imageUrl,
                categoryId: categoryId ? parseInt(categoryId) : undefined
            }
        });

        res.json(product);
    } catch (err) {
        console.error(err);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.removeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete local image file
        if (product.image && fs.existsSync(product.image)) {
            fs.unlinkSync(product.image);
        }

        await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
