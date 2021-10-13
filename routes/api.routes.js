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

/* Product by categories */
router.post('/categories/product'  , api.Post_CategoriesProduct)

/* Similar Product */
router.post('/similar/product'  , api.Post_SimilarProduct)

/* Search Product */
router.post('/search/product'  , api.Post_SearchProduct)

/* Address */
router.post('/add/address'  , api.Post_AddAddress)
router.post('/address'  , api.Post_Address)

/* Profile */
router.post('/profile'  , api.Post_Profile)

/* Review */
router.post('/add/review'  , api.Post_AddReview)
router.post('/review'  , api.Post_Review)

/* Change Password */
router.post('/change/password'  , api.Post_ChangePassword)

/* Version control */
router.get('/version/control'  , api.VersionControl)






module.exports = router;
