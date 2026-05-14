module.exports = (req, res, next) => {
    if (req.user && req.user.role === 'Dev') {
        next();
    } else {
        res.status(403).json({
            message: 'Access Denied: Developer access required'
        });
    }
};
