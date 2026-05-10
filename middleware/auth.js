const jwt = require('jsonwebtoken');

module.exports = async(req, res, next) => {

    try {

        const headerToken = req.headers.authorization;

        if (!headerToken) {
            return res.status(401).json({
                message: 'No Token'
            });
        }

        const token = headerToken.split(' ')[1];

        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decode;

        next();

    } catch (err) {

        console.log(err);

        res.status(401).json({
            message: 'Invalid Token'
        });

    }

}