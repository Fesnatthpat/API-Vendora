const prisma = require('../prisma/prisma');

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await prisma.category.create({
            data: { name }
        });
        res.status(201).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.listCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
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
        await prisma.category.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
