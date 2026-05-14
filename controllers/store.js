const prisma = require('../prisma/prisma');

exports.createStore = async (req, res) => {
    try {
        const { name, address, phone } = req.body;
        const userId = req.user.id;

        // Check if user already has a store
        const user = await prisma.staff.findUnique({
            where: { id: userId }
        });

        if (user.storeId) {
            return res.status(400).json({ message: 'User already belongs to a store' });
        }

        // Create store and link user to it
        const store = await prisma.store.create({
            data: {
                name,
                address,
                phone,
                staff: {
                    connect: { id: userId }
                }
            }
        });

        res.json({
            message: 'Store created successfully',
            store
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getMyStore = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.staff.findUnique({
            where: { id: userId },
            include: { store: true }
        });

        if (!user || !user.store) {
            return res.status(404).json({ message: 'Store not found for this user' });
        }

        res.json(user.store);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateStore = async (req, res) => {
    try {
        const { name, address, phone, currency, taxRate, includeTax, receiptNote } = req.body;
        const userId = req.user.id;

        const user = await prisma.staff.findUnique({
            where: { id: userId }
        });

        if (!user.storeId) {
            return res.status(404).json({ message: 'Store not found' });
        }

        const updatedStore = await prisma.store.update({
            where: { id: user.storeId },
            data: {
                name,
                address,
                phone,
                currency,
                taxRate,
                includeTax,
                receiptNote
            }
        });

        res.json({
            message: 'Store updated successfully',
            store: updatedStore
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
