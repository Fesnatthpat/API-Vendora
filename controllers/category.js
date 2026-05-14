const prisma = require('../prisma/prisma');

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const storeId = req.user.storeId;

        if (!storeId) {
            return res.status(400).json({ message: 'User does not belong to a store' });
        }

        const category = await prisma.category.create({
            data: { 
                name,
                storeId: storeId
            }
        });
        res.status(201).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.listCategories = async (req, res) => {
    try {
        const storeId = req.user.storeId;
        const categories = await prisma.category.findMany({
            where: { storeId },
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const storeId = req.user.storeId;

        const existingCategory = await prisma.category.findFirst({
            where: { 
                id: parseInt(id),
                storeId
            }
        });

        if (!existingCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data: { name }
        });
        res.json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.removeCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const storeId = req.user.storeId;

        const existingCategory = await prisma.category.findFirst({
            where: { 
                id: parseInt(id),
                storeId
            }
        });

        if (!existingCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await prisma.category.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

