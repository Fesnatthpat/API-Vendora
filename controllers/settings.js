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
        const { 
            name, 
            address, 
            phone, 
            currency, 
            taxRate, 
            includeTax, 
            receiptNote,
            loyaltyPointType,
            loyaltyPointRate,
            loyaltyPointThreshold
        } = req.body;

        const data = {
            name,
            address,
            phone,
            currency,
            taxRate: taxRate !== undefined ? parseFloat(taxRate) : undefined,
            includeTax: includeTax !== undefined ? (includeTax === true || includeTax === 'true') : undefined,
            receiptNote,
            loyaltyPointType,
            loyaltyPointRate: loyaltyPointRate !== undefined ? parseFloat(loyaltyPointRate) : undefined,
            loyaltyPointThreshold: loyaltyPointThreshold !== undefined ? parseInt(loyaltyPointThreshold) : undefined
        };

        // Remove undefined fields
        Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

        const settings = await prisma.storeSettings.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        res.json(settings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
