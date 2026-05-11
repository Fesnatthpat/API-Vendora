const prisma = require('../prisma/prisma');
const supabase = require('../config/supabase');
const path = require('path');

const BUCKET_NAME = 'vendora';

const uploadToSupabase = async (file) => {
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

    return publicUrl;
};

const deleteFromSupabase = async (imageUrl) => {
    try {
        if (!imageUrl || !imageUrl.includes('supabase.co')) return;
        
        // Extract filename from URL
        const parts = imageUrl.split('/');
        const fileName = parts[parts.length - 1];

        if (fileName) {
            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([fileName]);
            
            if (error) {
                console.error('Error deleting from Supabase:', error);
            }
        }
    } catch (err) {
        console.error('Failed to delete image from Supabase:', err);
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, category, price, cost, stock, minStockThreshold, barcode, sku, categoryId } = req.body;
        let imageUrl = null;

        if (req.file) {
            imageUrl = await uploadToSupabase(req.file);
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
            return res.status(404).json({ message: 'Product not found' });
        }

        let imageUrl = existingProduct.image;

        if (req.file) {
            // Delete old image from Supabase
            if (existingProduct.image) {
                await deleteFromSupabase(existingProduct.image);
            }
            // Upload new image
            imageUrl = await uploadToSupabase(req.file);
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

        // Delete image from Supabase
        if (product.image) {
            await deleteFromSupabase(product.image);
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

exports.getLowStockProducts = async (req, res) => {
    try {
        const lowStockProducts = await prisma.$queryRaw`
            SELECT * FROM "Product" 
            WHERE "stock" <= "minStockThreshold"
        `;

        res.json(lowStockProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

