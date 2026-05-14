const prisma = require('../prisma/prisma');

exports.getSettings = async (req, res) => {
    try {
        const storeId = req.user.storeId;
        if (!storeId) {
            return res.status(404).json({ message: 'Store not found' });
        }

        const settings = await prisma.store.findUnique({
            where: { id: storeId }
        });
        
        res.json(settings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const storeId = req.user.storeId;
        if (!storeId) {
            return res.status(404).json({ message: 'Store not found' });
        }

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

        const settings = await prisma.store.update({
            where: { id: storeId },
            data: data
        });

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

