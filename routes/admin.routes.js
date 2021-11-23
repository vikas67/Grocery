const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');


const upload = require('../middleware/upload');
const admin = require("../controllers/admin.controllers");
const {RoleAuth} = require("../middleware/RoleAuth")

router.get('/logout', admin.LogOut)

/* Dashboard */
router.get('/dashboard', RoleAuth('ADMIN'), admin.Dashboard)

/*  Categories */
router.get('/categories', RoleAuth('ADMIN'), admin.Category)
router.post('/categories', RoleAuth('ADMIN'), upload.single('icon'), admin.Post_Category)
router.delete('/categories', RoleAuth('ADMIN'), admin.Delete_Category)
router.patch('/categories/status', RoleAuth('ADMIN'), admin.Patch_CategoryStatus)
router.put('/categories', RoleAuth('ADMIN'), admin.Put_Category)

/* SubCategory */
router.get('/sub-categories', RoleAuth('ADMIN'), admin.SubCategory)
router.post('/sub-categories', RoleAuth('ADMIN'), admin.Post_SubCategory)
router.delete('/sub-categories', RoleAuth('ADMIN'), admin.Delete_SubCategory)

/* Product */
router.get('/product', RoleAuth('ADMIN'), admin.Product)
router.post('/product', RoleAuth('ADMIN'), upload.fields([
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
router.get('/state/list', RoleAuth('ADMIN'), admin.State)
router.post('/state/list', RoleAuth('ADMIN'), admin.Post_State)
router.delete('/state/list', RoleAuth('ADMIN'), admin.Delete_State)
router.patch('/state/list', RoleAuth('ADMIN'), admin.Patch_State)

/* City */
router.get('/city/list', RoleAuth('ADMIN'), admin.City)
router.post('/city/list', RoleAuth('ADMIN'), admin.Post_City)

/* Order  */
router.get('/order/all', RoleAuth('ADMIN'), admin.OrderAll)
router.get('/order/pending', RoleAuth('ADMIN'), admin.OrderPending)
router.get('/order/confirmed', RoleAuth('ADMIN'), admin.OrderConfirmed)
router.get('/order/processing', RoleAuth('ADMIN'), admin.OrderProcessing)
router.get('/order/out_of_delivery', RoleAuth('ADMIN'), admin.OrderOut_of_delivery)
router.get('/order/deliverd', RoleAuth('ADMIN'), admin.OrderDelivery)
router.get('/order/returned', RoleAuth('ADMIN'), admin.OrderReturned)
router.get('/order/failed', RoleAuth('ADMIN'), admin.OrderFailed)
router.get('/order/canceled', RoleAuth('ADMIN'), admin.OrderCanceled)
router.get('/order/info/:id', RoleAuth('ADMIN'), admin.OrderInfo)

/* Keyword */
router.get('/keyword', RoleAuth('ADMIN'), admin.Keyword)
router.post('/keyword', RoleAuth('ADMIN'), admin.Post_Keyword)

/* Version */
router.get('/version', RoleAuth('ADMIN'), admin.Version)
router.post('/version', RoleAuth('ADMIN'), admin.Post_Version)

/* Customer List */
router.get('/customer/list', RoleAuth('ADMIN'), admin.CustomerList)
router.patch('/customer/status', RoleAuth('ADMIN'), admin.Patch_CustomerList)

/* Send Notification */
router.get('/send/notification', RoleAuth('ADMIN'), admin.SendNotification)
router.post('/send/notification', RoleAuth('ADMIN'), upload.single("img"), admin.Post_SendNotification)

/* Role Managemnt */
router.get('/role-management', RoleAuth('ADMIN'), admin.RoleManagement)
router.post('/role-management', RoleAuth('ADMIN'), admin.Post_RoleManagement)
router.get('/edit/role-management/:id', RoleAuth('ADMIN'), admin.Edit_RoleManagement)

/* Employee */
router.get('/employee/add', RoleAuth('ADMIN'), admin.AddEmployee)
router.post('/employee/add', RoleAuth('ADMIN'), upload.single('img'), admin.Post_AddEmployee)

/* Flash Deal */
router.get("/flash-deal", RoleAuth('ADMIN'), admin.FlashDeal)
router.get("/flash-sale/product/:id", RoleAuth('ADMIN'), admin.FlashDealProduct)
router.post("/flash-deal", RoleAuth('ADMIN'), admin.Post_FlashDeal)

/* Selller */
router.get('/add/seller', RoleAuth('ADMIN'), admin.AddSeller)
router.get('/seller/list', RoleAuth('ADMIN'), admin.SellerList)
router.post('/add/seller', RoleAuth('ADMIN'), upload.fields([
    {
        name: 'image',
        count: 1
    },
    {
        name: 'shop_logo',
        count: 1
    },
]), admin.Post_AddSeller)

/* Product Details */
router.get('/product/details/:id', RoleAuth('ADMIN'), admin.ProductDetails)


/* Ajax */
router.post('/ajax/subcategory/fetch', RoleAuth('ADMIN'), admin.Ajax_SubCategories)
router.patch('/ajax/add/product/stock', RoleAuth('ADMIN'), admin.Ajax_ProductAddStock)


module.exports = router;
