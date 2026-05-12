module.exports = async(req, res, next) => {

    try {

        if (req.user.role !== 'Admin') {

            return res.status(403).json({
                message: 'Access Denied'
            });

        }

        next();

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: 'Server Error'
        });

    }

}