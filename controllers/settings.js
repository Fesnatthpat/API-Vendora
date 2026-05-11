const prisma = require('../prisma/prisma');

exports.getSettings = async (req, res) => {
    try {
        let settings = await prisma.storeSettings.findFirst({
            where: { id: 1 }
        });
        
        if (!settings) {
            // Create default settings if not exists
            settings = await prisma.storeSettings.create({
                data: { id: 1 }
            });
        }
        
        res.json(settings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const data = req.body;
        const settings = await prisma.storeSettings.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        res.json(settings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
