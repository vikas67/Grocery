const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/login', require('../controllers/admin.controllers').Login);
router.post(
    '/login',
    passport.authenticate('local', {
        successReturnToOrRedirect: '/seller/dashboard',
        failureRedirect: '/seller/auth/login',
        failureFlash: true,
    })
);


module.exports = router;