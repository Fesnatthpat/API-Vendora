module.exports = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: `Access Denied: ${req.user.role} is not authorized for this resource`
                });
            }

            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    };
};