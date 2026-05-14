require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { readdirSync } = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security Middleware
app.use(helmet());
app.use(cors()); // In production, configure this with specific origin

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Apply limiter to all requests
app.use('/api', limiter);

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