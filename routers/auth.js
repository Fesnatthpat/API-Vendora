const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { register, login, getMe, changePassword } = require('../controllers/auth');


router.post('/register',register);
router.post('/login',login);
router.get('/me', auth, getMe);
router.put('/change-password', auth, changePassword);





module.exports = router;