module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.user = {
            profilePicture: req.user.profilePicture || 'path/to/default/picture.jpg',
            name: req.user.name || 'Default Name',
            email: req.user.email || 'default@example.com'
        };
    }
    next();
};
