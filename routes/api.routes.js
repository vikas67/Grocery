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
router.get('/category' , verifyAccessToken , api.Category)















module.exports = router;
