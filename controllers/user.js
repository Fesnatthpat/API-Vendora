const prisma = require('../prisma/prisma');
const bcrypt = require('bcryptjs');


// CREATE USER (ADMIN ONLY)
exports.createUser = async(req, res) => {
    try {
        const { name, username, password, role, status } = req.body;

        const existingUser = await prisma.staff.findUnique({
            where: { username }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.staff.create({
            data: {
                name,
                username,
                password: hashedPassword,
                role: role || 'Cashier',
                status: status || 'Active'
            }
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                role: newUser.role,
                status: newUser.status
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET ALL USERS
exports.listUsers = async(req, res) => {

    try {

        const users = await prisma.staff.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                role: true,
                status: true,
                joinDate: true
            }
        });

        res.json(users);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};


// GET USER BY ID
exports.getUser = async(req, res) => {

    try {

        const { id } = req.params;

        const user = await prisma.staff.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                name: true,
                username: true,
                role: true,
                status: true,
                joinDate: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json(user);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};


// UPDATE USER
exports.updateUser = async(req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            username,
            password,
            role,
            status
        } = req.body;

        const existingUser = await prisma.staff.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        let hashedPassword = existingUser.password;

        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.staff.update({
            where: {
                id: Number(id)
            },
            data: {
                name,
                username,
                password: hashedPassword,
                role,
                status
            }
        });

        res.json({
            message: 'User updated',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                username: updatedUser.username,
                role: updatedUser.role,
                status: updatedUser.status
            }
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};


// DELETE USER
exports.deleteUser = async(req, res) => {

    try {

        const { id } = req.params;

        const existingUser = await prisma.staff.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        await prisma.staff.delete({
            where: {
                id: Number(id)
            }
        });

        res.json({
            message: 'User deleted'
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};