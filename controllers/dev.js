const prisma = require('../prisma/prisma');

// GET /api/dev/stats
exports.getDevStats = async (req, res) => {
    try {
        const totalStores = await prisma.store.count();
        const totalUsers = await prisma.staff.count();
        const totalProducts = await prisma.product.count();
        const totalOrders = await prisma.order.count();

        res.json({
            totalStores,
            totalUsers,
            totalProducts,
            totalOrders
        });
    } catch (err) {
        console.error('Dev Stats Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET /api/dev/stores
exports.listAllStores = async (req, res) => {
    try {
        const stores = await prisma.store.findMany({
            include: {
                staff: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        role: true,
                        status: true
                    }
                },
                _count: {
                    select: {
                        staff: true,
                        products: true,
                        orders: true,
                        categories: true,
                        customers: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(stores);
    } catch (err) {
        console.error('List All Stores Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// PUT /api/dev/stores/:storeId/features
exports.updateStoreFeatures = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { features } = req.body;

        const updatedStore = await prisma.store.update({
            where: { id: parseInt(storeId) },
            data: { features }
        });

        res.json({
            message: 'Store features updated',
            store: updatedStore
        });
    } catch (err) {
        console.error('Update Store Features Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// PUT /api/dev/stores/:storeId/status
exports.updateStoreStatus = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { status } = req.body;

        const updatedStore = await prisma.store.update({
            where: { id: parseInt(storeId) },
            data: { status }
        });

        res.json({
            message: 'Store status updated',
            store: updatedStore
        });
    } catch (err) {
        console.error('Update Store Status Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET /api/dev/stores/:storeId/staff
exports.listStoreStaff = async (req, res) => {
    try {
        const { storeId } = req.params;
        const staff = await prisma.staff.findMany({
            where: { storeId: parseInt(storeId) },
            select: {
                id: true,
                name: true,
                username: true,
                role: true,
                status: true,
                joinDate: true
            }
        });
        res.json(staff);
    } catch (err) {
        console.error('List Store Staff Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE /api/dev/users/:userId
exports.deleteUserGlobal = async (req, res) => {
    try {
        const { userId } = req.params;

        await prisma.staff.delete({
            where: { id: parseInt(userId) }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete User Global Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
