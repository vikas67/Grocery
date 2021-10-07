var express = require('express');
var router = express.Router();

const {verifyAccessToken} = require('../util/jwt.helper')

var api = require("../controllers/v1/api.controllers")


/* Refresh Token */
router.post('/refresh-token' , api.Post_Refresh_token)


/* Register */
router.post('/register' , api.Post_Register)

/* Login */
router.post('/login'  , api.Post_Login)

/* Category */
router.get('/category' ,  api.Category)

/* Category */
router.post('/register/number' , api.Post_Register_Number)

/* Otp */
router.post('/verify/otp' , api.Post_VerifyOtp)
router.post('/resend/otp' , api.Post_ResendOtp)

/* Forgot password */
router.post('/forgot/password' , api.Post_ForgotPassword)

/* Reset Password */
router.post('/reset/password' , api.Post_ResetPassword)











module.exports = router;
