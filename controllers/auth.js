const prisma = require('../prisma/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async(req, res) => {
    try {

        const { name, username, password } = req.body;

        const existingUser = await prisma.staff.findUnique({
            where: {
                username
            }
        });

        if(existingUser){
            return res.status(400).json({
                message: 'Username already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStaff = await prisma.staff.create({
            data: {
                name,
                username,
                password: hashedPassword
            }
        });

        res.json({
            message: 'Register success',
            user: newStaff
        });

    } catch(err){
        console.log(err);

        res.status(500).json({
            message: 'Server Error'
        });
    }
}   

exports.login = async(req, res) => {
    try {

        const { username, password } = req.body;

        const staff = await prisma.staff.findUnique({
            where: {
                username
            }
        });

        if (!staff) {
            return res.status(404).json({
                message: 'Staff not found'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            staff.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid password'
            });
        }
         // เช็ค JWT_SECRET
        console.log(process.env.JWT_SECRET);

        // สร้าง JWT Token
        const token = jwt.sign(
            {
                id: staff.id,
                username: staff.username,
                role: staff.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        res.json({
            message: 'Login success',
            token,
            user: {
                id: staff.id,
                name: staff.name,
                username: staff.username,
                role: staff.role
            }
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: 'Server Error'
        });

    }
}

exports.getMe = async (req, res) => {
    try {
        const staff = await prisma.staff.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                username: true,
                role: true,
                status: true,
                joinDate: true
            }
        });

        if (!staff) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(staff);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};