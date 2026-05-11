const prisma = require('../prisma/prisma');

exports.listStockMovements = async (req, res) => {
    try {
        const { productId } = req.query;
        let where = {};
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
        
        const result = await prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({ where: { id: productId } });
            if (!product) throw new Error('Product not found');

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
                    note
                }
            });
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Stock Adjustment Failed', error: err.message });
    }
};
