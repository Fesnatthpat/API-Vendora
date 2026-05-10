require('dotenv').config();

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { readdirSync } = require('fs');
const cors = require('cors');

// const authRouter = require('./routers/auth');
// const userRouter = require('./routers/user');


app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use('/uploads', express.static('uploads'));

readdirSync('./routers')
.map((c) => app.use('/api', require('./routers/' + c)));

app.get('/', (req, res) => {
    res.send('API Online');
});

// app.use('/api', authRouter);
// app.use('/api', userRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`)
);