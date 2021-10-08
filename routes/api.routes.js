const express = require('express');
const router = express.Router();

const {verifyAccessToken} = require('../util/jwt.helper')

const api = require("../controllers/v1/api.controllers")


/* Refresh Token */
router.post('/refresh-token' , api.Post_Refresh_token)

/* Register */
router.post('/register' , api.Post_Register)

/* Login */
router.post('/login'  , api.Post_Login)

/* Otp */
router.post('/verify/otp' , api.Post_VerifyOtp)
router.post('/resend/otp' , api.Post_ResendOtp)

/* Forgot password */
router.post('/forgot/password'  , api.Post_ForgotPassword)

/* Reset Password */
router.post('/reset/password' , api.Post_ResetPassword)

/* Register Number */
router.post('/register/number', verifyAccessToken , api.Post_Register_Number)

/* Category */
router.get('/category' ,  api.Category)

/* Sub Category */
router.post('/sub-category'  , api.SubCategory)

/* Notification */
router.get('/notification'  , api.Notification)

/* Product by Sub categories */
router.post('/subcategories/product'  , api.Post_SubCategoriesProduct)










module.exports = router;
