const prisma = require('../prisma/prisma');

exports.getSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Today's Sales & Profit
        const todayStats = await prisma.order.aggregate({
            where: {
                timestamp: { gte: today },
                status: 'completed'
            },
            _sum: {
                total: true,
                profit: true
            },
            _count: {
                id: true
            }
        });

        // 2. Total Sales & Profit (All time)
        const allTimeStats = await prisma.order.aggregate({
            where: { status: 'completed' },
            _sum: {
                total: true,
                profit: true
            }
        });

        // 3. Customer Count
        const customerCount = await prisma.customer.count();

        // 4. Low Stock Count
        const lowStockProducts = await prisma.$queryRaw`
            SELECT COUNT(*)::int as count FROM "Product" 
            WHERE "stock" <= "minStockThreshold"
        `;

        res.json({
            todaySales: todayStats._sum.total || 0,
            todayProfit: todayStats._sum.profit || 0,
            todayOrders: todayStats._count.id || 0,
            totalSales: allTimeStats._sum.total || 0,
            totalProfit: allTimeStats._sum.profit || 0,
            totalCustomers: customerCount,
            lowStockCount: lowStockProducts[0].count || 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getTopProducts = async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        
        // This is a bit complex with Prisma because items are stored as JSON
        // For a real production app, an OrderItem table is better.
        // But for this JSON schema, we'll fetch recent orders and aggregate in JS or use raw SQL
        
        const orders = await prisma.order.findMany({
            where: { status: 'completed' },
            select: { items: true },
            take: 100 // Look at last 100 orders for top products
        });

        const productSales = {};
        orders.forEach(order => {
            const items = order.items;
            items.forEach(item => {
                if (!productSales[item.name]) {
                    productSales[item.name] = { name: item.name, quantity: 0, total: 0 };
                }
                productSales[item.name].quantity += item.quantity;
                productSales[item.name].total += (item.price * item.quantity);
            });
        });

        const sortedProducts = Object.values(productSales)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, parseInt(limit));

        res.json(sortedProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getSalesChart = async (req, res) => {
    try {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - i);
            last7Days.push(d);
        }

        const chartData = await Promise.all(last7Days.map(async (date) => {
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            const stats = await prisma.order.aggregate({
                where: {
                    timestamp: {
                        gte: date,
                        lt: nextDate
                    },
                    status: 'completed'
                },
                _sum: {
                    total: true
                }
            });

            return {
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                fullDate: date.toISOString().split('T')[0],
                total: stats._sum.total || 0
            };
        }));

        res.json(chartData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};