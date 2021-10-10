const express = require('express');
const router = express.Router();
const passport = require('passport');

/* Auth */
router.get('/login', require('../controllers/admin.controllers').Login);
router.post(
    '/login',
    passport.authenticate('local', {
        // successRedirect: '/admin/dashboard',
        successReturnToOrRedirect: '/admin/dashboard',
        failureRedirect: '/auth/admin/login',
        failureFlash: true,
    })
);





module.exports = router;