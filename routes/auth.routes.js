var express = require('express');
var router = express.Router();
const passport = require('passport');

/* Auth */
router.get('/login', require('../controllers/admin.controllers').Login);
router.post(
    '/login',
    passport.authenticate('local', {
        // successRedirect: '/admin/dashboard',
        successReturnToOrRedirect: '/admin/dashboard',
        failureRedirect: '/admin/login',
        failureFlash: true,
    })
);





module.exports = router;