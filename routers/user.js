const express = require('express');
const router = express.Router();

const {
    createUser,
    listUsers,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/user');

const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');


// ADMIN ONLY
router.post(
    '/user',
    authMiddleware,
    adminMiddleware,
    createUser
);


// USER LOGIN REQUIRED
router.get(
    '/users',
    authMiddleware,
    listUsers
);


// USER LOGIN REQUIRED
router.get(
    '/user/:id',
    authMiddleware,
    getUser
);


// ADMIN ONLY
router.put(
    '/user/:id',
    authMiddleware,
    adminMiddleware,
    updateUser
);


// ADMIN ONLY
router.delete(
    '/user/:id',
    authMiddleware,
    adminMiddleware,
    deleteUser
);

module.exports = router;