const prisma = require('../prisma/prisma');

exports.listStockMovements = async (req, res) => {
    try {
        const { productId } = req.query;
        const storeId = req.user.storeId;
        let where = { storeId };
        if (productId) where.productId = parseInt(productId);

        const movements = await prisma.stockMovement.findMany({
            where,
            orderBy: { timestamp: 'desc' },
            include: { product: true }
        });
        res.json(movements);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.adjustStock = async (req, res) => {
    try {
        const { productId, type, quantity, note, supplier } = req.body;
        const storeId = req.user.storeId;

        if (!storeId) {
            return res.status(400).json({ message: 'User does not belong to a store' });
        }
        
        const result = await prisma.$transaction(async (tx) => {
            const product = await tx.product.findFirst({ 
                where: { 
                    id: productId,
                    storeId
                } 
            });
            if (!product) throw new Error('Product not found in this store');

            const previousStock = product.stock;
            let newStock = previousStock;

            if (type === 'IN') newStock += quantity;
            else if (type === 'OUT') newStock -= quantity;
            else if (type === 'SET') newStock = quantity;

            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: { stock: newStock }
            });

            return await tx.stockMovement.create({
                data: {
                    productId,
                    productName: product.name,
                    type,
                    quantity,
                    previousStock,
                    newStock,
                    costAtTime: product.cost,
                    supplier,
                    note,
                    storeId
                }
            });
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Stock Adjustment Failed', error: err.message });
    }
};

