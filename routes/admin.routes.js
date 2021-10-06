const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');


const upload = require('../middleware/upload')

const admin = require("../controllers/admin.controllers")


/* Dashboard */
router.get('/dashboard' , admin.Dashboard)
/*  Categories */
router.get('/categories' , admin.Category)
router.post('/categories', upload.single('icon') , admin.Post_Category)
router.delete('/categories',  admin.Delete_Category)
router.patch('/categories/status',  admin.Patch_CategoryStatus)

/* SubCategory */
router.get('/sub-categories' , admin.SubCategory)
router.post('/sub-categories', upload.single('icon') , admin.Post_SubCategory)

/* Product */
router.get('/product' , admin.Product)
router.post('/product' , admin.Post_Product)



module.exports = router;
