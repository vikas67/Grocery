const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload')

const admin = require("../controllers/admin.controllers")

/* Login */
router.get("/login" , admin.Login)
router.post("/login" , admin.Post_Login)

/*  Category */
router.get('/sub-category' , admin.SubCategory)
router.post('/sub-category', upload.single('icon') , admin.Post_SubCategory)

/* SubCategory */





module.exports = router;
