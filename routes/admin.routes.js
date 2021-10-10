const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');


const upload = require('../middleware/upload');
const admin = require("../controllers/admin.controllers");


/* Dashboard */
router.get('/dashboard' , admin.Dashboard)

/*  Categories */
router.get('/categories' , admin.Category)
router.post('/categories', upload.single('icon') , admin.Post_Category)
router.delete('/categories',  admin.Delete_Category)
router.patch('/categories/status', admin.Patch_CategoryStatus)
router.put('/categories', admin.Put_Category)

/* SubCategory */
router.get('/sub-categories', admin.SubCategory)
router.post('/sub-categories', admin.Post_SubCategory)
router.delete('/sub-categories', admin.Delete_SubCategory)

/* Product */
router.get('/product', admin.Product)
router.post('/product', upload.fields([
    {
        name: 'product_thumb',
        count: 1
    },
    {
        name: 'product_img',
        count: 10
    },
]), admin.Post_Product)
router.get('/list/product', admin.ListProduct)

/* State */
router.get('/state/list', admin.State)
router.post('/state/list', admin.Post_State)
router.delete('/state/list', admin.Delete_State)
router.patch('/state/list', admin.Patch_State)

/* City */
router.get('/city/list', admin.City)

/* Order  */
router.get('/order/all' , admin.OrderAll)
router.get('/order/pending' , admin.OrderPending)
router.get('/order/confirmed' , admin.OrderConfirmed)
router.get('/order/processing' , admin.OrderProcessing)
router.get('/order/out_of_delivery' , admin.OrderOut_of_delivery)
router.get('/order/deliverd' , admin.OrderDelivery)
router.get('/order/returned' , admin.OrderReturned)
router.get('/order/failed' , admin.OrderFailed)
router.get('/order/canceled' , admin.OrderCanceled)

/* Keyword */
router.get('/keyword' , admin.Keyword)
router.post('/keyword' , admin.Post_Keyword)


/* Ajax */
router.post('/ajax/subcategory/fetch', admin.Ajax_SubCategories)


module.exports = router;
