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
        console.log('Incoming Settings Update:', req.body);
        
        // Extract data, handling potential nesting if frontend sends it that way
        const body = req.body.settings || req.body;

        const { 
            name, 
            address, 
            phone, 
            currency, 
            taxRate, 
            tax_rate,
            includeTax, 
            include_tax, 
            receiptNote,
            receipt_note,
            loyaltyPointType,
            loyalty_point_type,
            loyaltyPointRate,
            loyalty_point_rate,
            loyaltyPointThreshold,
            loyalty_point_threshold
        } = body;

        // Construct clean data object for Prisma
        const data = {};
        
        if (name !== undefined) data.name = name;
        if (address !== undefined) data.address = address;
        if (phone !== undefined) data.phone = phone;
        if (currency !== undefined) data.currency = currency;
        
        const finalTaxRate = taxRate ?? tax_rate;
        if (finalTaxRate !== undefined) data.taxRate = parseFloat(finalTaxRate);
        
        const finalIncludeTax = includeTax ?? include_tax;
        if (finalIncludeTax !== undefined) {
            data.includeTax = String(finalIncludeTax) === 'true' || finalIncludeTax === true;
        }
        
        const finalReceiptNote = receiptNote ?? receipt_note;
        if (finalReceiptNote !== undefined) data.receiptNote = finalReceiptNote;
        
        const finalLoyaltyPointType = loyaltyPointType ?? loyalty_point_type;
        if (finalLoyaltyPointType !== undefined) data.loyaltyPointType = finalLoyaltyPointType;
        
        const finalLoyaltyPointRate = loyaltyPointRate ?? loyalty_point_rate;
        if (finalLoyaltyPointRate !== undefined) data.loyaltyPointRate = parseFloat(finalLoyaltyPointRate);
        
        const finalLoyaltyPointThreshold = loyaltyPointThreshold ?? loyalty_point_threshold;
        if (finalLoyaltyPointThreshold !== undefined) data.loyaltyPointThreshold = parseInt(finalLoyaltyPointThreshold);

        console.log('Cleaned Data for DB:', data);

        // Check if settings record exists
        const existing = await prisma.storeSettings.findFirst({ where: { id: 1 } });

        let settings;
        if (existing) {
            settings = await prisma.storeSettings.update({
                where: { id: 1 },
                data: data
            });
            console.log('Settings Updated successfully');
        } else {
            settings = await prisma.storeSettings.create({
                data: { id: 1, ...data }
            });
            console.log('Settings Created successfully');
        }

        res.json(settings);
    } catch (err) {
        console.error('Update Settings Detailed Error:', err);
        res.status(500).json({ 
            message: 'Server Error', 
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
        });
    }
};
