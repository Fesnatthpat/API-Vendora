const prisma = require('../prisma/prisma');
const bcrypt = require('bcryptjs');

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

        console.log('Logging in staff:', {
            username
        });

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

        console.log('Staff logged in:', staff);

        res.json({
            message: 'Login success',
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