const createError = require('http-errors')


exports.RoleAuth = roles => async (req, res, next) => {
    // let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let userRole = req.user.roles
    if (roles.toUpperCase() !== userRole.toUpperCase()) {
        req.logout()
        next(createError.Unauthorized())
    }
    next()
}
