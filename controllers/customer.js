const prisma = require('../prisma/prisma');

exports.createCustomer = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const customer = await prisma.customer.create({
            data: { name, phone }
        });
        res.status(201).json(customer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.listCustomers = async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: { joinDate: 'desc' }
        });
        res.json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await prisma.customer.findUnique({
            where: { id: parseInt(id) },
            include: {
                orders: {
                    take: 5,
                    orderBy: { timestamp: 'desc' }
                },
                pointLogs: {
                    take: 5,
                    orderBy: { timestamp: 'desc' }
                }
            }
        });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, points, level } = req.body;
        const customer = await prisma.customer.update({
            where: { id: parseInt(id) },
            data: { name, phone, points, level }
        });
        res.json(customer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.removeCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.customer.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.findCustomerByPhone = async (req, res) => {
    try {
        const { phone } = req.params;
        const customer = await prisma.customer.findFirst({
            where: { phone }
        });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.redeemCustomerPoints = async (req, res) => {
    try {
        const { id } = req.params;
        const { points, note } = req.body;
        const pointsToRedeem = parseInt(points);

        if (isNaN(pointsToRedeem) || pointsToRedeem <= 0) {
            return res.status(400).json({ message: 'Invalid points value' });
        }

        const result = await prisma.$transaction(async (tx) => {
            const customer = await tx.customer.findUnique({
                where: { id: parseInt(id) }
            });

            if (!customer) throw new Error('Customer not found');
            if (customer.points < pointsToRedeem) throw new Error('Insufficient points');

            const updatedCustomer = await tx.customer.update({
                where: { id: parseInt(id) },
                data: {
                    points: { decrement: pointsToRedeem },
                    rewardsEarned: { increment: 1 }
                }
            });

            await tx.pointLog.create({
                data: {
                    customerId: parseInt(id),
                    amount: -pointsToRedeem,
                    after: updatedCustomer.points,
                    note: note || 'Point Redemption'
                }
            });

            return updatedCustomer;
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Server Error' });
    }
};

exports.adjustCustomerPoints = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, note } = req.body;
        const adjustmentAmount = parseInt(amount);

        if (isNaN(adjustmentAmount)) {
            return res.status(400).json({ message: 'Invalid amount value' });
        }

        const result = await prisma.$transaction(async (tx) => {
            const customer = await tx.customer.findUnique({
                where: { id: parseInt(id) }
            });

            if (!customer) throw new Error('Customer not found');

            // Prevent negative points after adjustment
            if (customer.points + adjustmentAmount < 0) {
                throw new Error('Adjustment would result in negative points');
            }

            const updatedCustomer = await tx.customer.update({
                where: { id: parseInt(id) },
                data: {
                    points: { increment: adjustmentAmount }
                }
            });

            await tx.pointLog.create({
                data: {
                    customerId: parseInt(id),
                    amount: adjustmentAmount,
                    after: updatedCustomer.points,
                    note: note || 'Manual Adjustment'
                }
            });

            return updatedCustomer;
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Server Error' });
    }
};
