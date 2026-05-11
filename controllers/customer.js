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
