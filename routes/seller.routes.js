const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');


const upload = require('../middleware/upload');
const admin = require("../controllers/admin.controllers");
const {RoleAuth} = require("../middleware/RoleAuth")

router.get('/logout', admin.LogOut)

/* Dashboard */
router.get('/dashboard', RoleAuth('SELLER'), admin.Dashboard)

/*
/!*  Categories *!/
router.get('/categories', RoleAuth('SELLER'), admin.Category)
router.post('/categories', RoleAuth('SELLER'), upload.single('icon'), admin.Post_Category)
router.delete('/categories', RoleAuth('SELLER'), admin.Delete_Category)
router.patch('/categories/status', RoleAuth('SELLER'), admin.Patch_CategoryStatus)
router.put('/categories', RoleAuth('SELLER'), admin.Put_Category)
*/

/*
/!* SubCategory *!/
router.get('/sub-categories', RoleAuth('SELLER'), admin.SubCategory)
router.post('/sub-categories', RoleAuth('SELLER'), admin.Post_SubCategory)
router.delete('/sub-categories', RoleAuth('SELLER'), admin.Delete_SubCategory)
*/

/* Product */
router.get('/product', RoleAuth('SELLER'), admin.Product)
router.post('/product', RoleAuth('SELLER'), upload.fields([
    {
        name: 'product_thumb',
        count: 1
    },
    {
        name: 'product_img',
        count: 10
    },
]), admin.Post_Product)
router.get('/list/product', RoleAuth('SELLER'), admin.ListProduct)

/*
/!* State *!/
router.get('/state/list', RoleAuth('SELLER'), admin.State)
router.post('/state/list', RoleAuth('SELLER'), admin.Post_State)
router.delete('/state/list', RoleAuth('SELLER'), admin.Delete_State)
router.patch('/state/list', RoleAuth('SELLER'), admin.Patch_State)


/!* City *!/
router.get('/city/list', RoleAuth('SELLER'), admin.City)
router.post('/city/list', RoleAuth('SELLER'), admin.Post_City)
*/


/* Order  */
router.get('/order/all', RoleAuth('SELLER'), admin.OrderAll)
router.get('/order/pending', RoleAuth('SELLER'), admin.OrderPending)
router.get('/order/confirmed', RoleAuth('SELLER'), admin.OrderConfirmed)
router.get('/order/processing', RoleAuth('SELLER'), admin.OrderProcessing)
router.get('/order/out_of_delivery', RoleAuth('SELLER'), admin.OrderOut_of_delivery)
router.get('/order/deliverd', RoleAuth('SELLER'), admin.OrderDelivery)
router.get('/order/returned', RoleAuth('SELLER'), admin.OrderReturned)
router.get('/order/failed', RoleAuth('SELLER'), admin.OrderFailed)
router.get('/order/canceled', RoleAuth('SELLER'), admin.OrderCanceled)
router.get('/order/info/:id', RoleAuth('SELLER'), admin.OrderInfo)

/* Keyword */
router.get('/keyword', RoleAuth('SELLER'), admin.Keyword)
router.post('/keyword', RoleAuth('SELLER'), admin.Post_Keyword)

/*
/!* Version *!/
router.get('/version', RoleAuth('SELLER'), admin.Version)
router.post('/version', RoleAuth('SELLER'), admin.Post_Version)

/!* Customer List *!/
router.get('/customer/list', RoleAuth('SELLER'), admin.CustomerList)
router.patch('/customer/status', RoleAuth('SELLER'), admin.Patch_CustomerList)

/!* Send Notification *!/
router.get('/send/notification', RoleAuth('SELLER'), admin.SendNotification)
router.post('/send/notification', RoleAuth('SELLER'), upload.single("img"), admin.Post_SendNotification)

/!* Role Managemnt *!/
router.get('/role-management', RoleAuth('SELLER'), admin.RoleManagement)
router.post('/role-management', RoleAuth('SELLER'), admin.Post_RoleManagement)
router.get('/edit/role-management/:id', RoleAuth('SELLER'), admin.Edit_RoleManagement)

/!* Employee *!/
router.get('/employee/add', RoleAuth('SELLER'), admin.AddEmployee)
router.post('/employee/add', RoleAuth('SELLER'), upload.single('img'), admin.Post_AddEmployee)

/!* Flash Deal *!/
router.get("/flash-deal", RoleAuth('SELLER'), admin.FlashDeal)
router.get("/flash-sale/product/:id", RoleAuth('SELLER'), admin.FlashDealProduct)
router.post("/flash-deal", RoleAuth('SELLER'), admin.Post_FlashDeal)

/!* Selller *!/
router.get('/add/seller', RoleAuth('SELLER'), admin.AddSeller)
router.get('/seller/list', RoleAuth('SELLER'), admin.SellerList)
router.post('/add/seller', RoleAuth('SELLER'), upload.fields([
    {
        name: 'image',
        count: 1
    },
    {
        name: 'shop_logo',
        count: 1
    },
]), admin.Post_AddSeller)
*/

/* Product Details */
router.get('/product/details/:id', RoleAuth('SELLER'), admin.ProductDetails)


/* Ajax */
router.post('/ajax/subcategory/fetch', RoleAuth('SELLER'), admin.Ajax_SubCategories)
router.patch('/ajax/add/product/stock', RoleAuth('SELLER'), admin.Ajax_ProductAddStock)


module.exports = router;
