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
router.put('/categories',  admin.Put_Category)

/* SubCategory */
router.get('/sub-categories' , admin.SubCategory)
router.post('/sub-categories' , admin.Post_SubCategory)
router.delete('/sub-categories' , admin.Delete_SubCategory)

/* Product */
router.get('/product' , admin.Product)
router.post('/product' , admin.Post_Product)

/* State */
router.get('/state/list' , admin.State)
router.post('/state/list' , admin.Post_State)
router.delete('/state/list' , admin.Delete_State)
router.patch('/state/list' , admin.Patch_State)

/* City */
router.get('/city/list' , admin.City)




module.exports = router;
