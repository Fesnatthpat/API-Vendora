require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { readdirSync } = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Enable trust proxy if you are behind Nginx, Cloudflare, etc.
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors());

// 1. General API Limiter (For POS operations, fetching products, etc.)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000,
    message: { message: 'Too many requests, please try again after 15 minutes' }
});

// 2. Auth Limiter (For Login and Register - stricter for security)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30, // Limit login/register to 30 attempts per 15 minutes
    message: { message: 'Too many login or register attempts, please try again after 15 minutes' }
});

// Apply limiters
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);
app.use('/api', apiLimiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Routes
readdirSync('./routers')
    .map((c) => app.use('/api', require('./routers/' + c)));

app.get('/', (req, res) => {
    res.send('API Online');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`)
);