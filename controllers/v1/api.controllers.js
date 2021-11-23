const mongoose = require('mongoose');
const slugify = require('slugify')
const Validation = require('../../util/ApiValidationSchema')
const moment = require('moment');
const createError = require('http-errors')
const rn = require('random-number');
const bcrypt = require('bcrypt');

/*  JWT  */
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../../util/jwt.helper')

/*  MODEL */
const User = require('../../model/user.model');
const Categories = require('../../model/categories.model');
const Notification = require('../../model/notification.model');
const Product = require('../../model/product.model');
const Address = require('../../model/address.model');
const Review = require('../../model/review.model');
const VersionControl = require('../../model/version.model');
const Order = require('../../model/order.model');
const Stock = require('../../model/stock.model');


exports.Post_Register = async (req, res, next) => {

    try {


        const result = await Validation.register.validateAsync(req.body)

        const doesExist = await User.findOne({email: result.email})
        if (doesExist) {

            const doesAuthExist = await User.findOne({$and: [{email: result.email}, {auth: true}]})

            if (doesAuthExist) {

                const accessToken = await signAccessToken(doesAuthExist.id)
                const refreshToken = await signRefreshToken(doesAuthExist.id)

                res.status(200).send({
                    error: false,
                    message: 'auth register failed',
                    code: 200,
                    user: doesAuthExist,
                    accessToken,
                    refreshToken
                })

                return;
            }
            throw createError.Conflict(`${result.email} is already been registered`)
        }


        const users = {
            name: result.username,
            email: result.email,
            password: result.password
        }

        const user = new User(users)
        const savedUser = await user.save()

        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRefreshToken(savedUser.id)

        res.status(200).send({
            error: false,
            message: 'register successfully',
            code: 200,
            user: savedUser,
            accessToken,
            refreshToken
        })

    } catch (error) {

        if (error.isJoi === true) error.status = 422
        next(error)

    }

}
exports.Post_Login = async (req, res, next) => {

    try {

        const result = await Validation.login.validateAsync(req.body)

        const user = await User.findOne({$and: [{email: result.email}, {auth: true}]})

        if (!user) throw createError.NotFound('User not registered')

        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch)
            throw createError.Unauthorized('Username/password not valid')

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)

        res.send({accessToken, refreshToken, user})

    } catch (error) {
        if (error.isJoi === true) return next(createError.BadRequest('Invalid Username/Password'))
        next(error)
    }

}
exports.Post_Refresh_token = async (req, res, next) => {

    const {refreshToken} = req.body
    if (!refreshToken) throw createError.BadRequest()
    const userId = await verifyRefreshToken(refreshToken)

    const accessToken = await signAccessToken(userId)
    const refToken = await signRefreshToken(userId)
    res.send({accessToken: accessToken, refreshToken: refToken})

}
exports.Category = async (req, res, next) => {
    try {

        const categories = await Categories.find(
            {
                $and: [
                    {position: 1},
                    {status: true},
                    {parent_id: null}
                ]
            }
        ).sort({created_at: -1})

        res.send({
            error: false,
            message: 'categories list',
            code: 200,
            categories: categories
        })

    } catch (e) {
        next(e)
    }
}
exports.SubCategory = async (req, res, next) => {
    try {

        const result = await Validation.subCategories.validateAsync(req.body);

        if (!validId(result.categories_id)) {
            res.status(200).send({error: true, message: "Invalid object id"})
        }

        let _id = mongoose.Types.ObjectId(result.categories_id)

        const subCategories = await Categories.find(
            {
                $and: [
                    {position: 2},
                    {status: true},
                    {parent_id: _id}
                ]
            }
        ).sort({created_at: -1})

        res.send({
            error: false,
            message: 'sub categories list',
            code: 200,
            sub_categories: subCategories
        })

    } catch (e) {
        if (e.isJoi === true) e.status = 422
        next(e)
    }
}
exports.Post_Register_Number = async (req, res, next) => {
    try {

        const result = await Validation.RegisterNumber.validateAsync(req.body);

        if (!validId(result.user_id)) {
            throw createError.NotFound("Invalid user id")
        }
        let _id = mongoose.Types.ObjectId(result.user_id);

        const user = await User.findOne({_id})

        if (!user) {
            throw createError.NotFound('User not registered')
        }

        let options = {
            min: 100000
            , max: 999999
            , integer: true
        }

        let otp = rn(options)

        await User.updateOne({_id}, {number: result.mobile_number, otp});

        res.send({
            error: false,
            message: 'Number register',
            code: 200,
            otp
        })

    } catch (e) {
        if (e.isJoi === true) e.status = 422
        next(e)
    }
}
exports.Post_VerifyOtp = async (req, res, next) => {
    try {

        const result = await Validation.RegisterNumber.validateAsync(req.body);

        if (!validId(result.user_id)) {
            throw createError.NotFound("Invalid user id")
        }
        let _id = mongoose.Types.ObjectId(result.user_id);

        const user = await User.findOne({$and: [{_id}, {otp: result.otp}]})

        if (!user) {
            throw createError.NotFound('User not registered')
        }

        await User.findOne({$and: [{_id}, {otp: null}]})

        res.send({
            error: false,
            message: 'verify otp',
            code: 200,
        })

    } catch (e) {
        if (e.isJoi === true) e.status = 422
        next(e)
    }
}
exports.Post_ResendOtp = async (req, res, next) => {
    try {

        const result = await Validation.ResendOtp.validateAsync(req.body);

        if (!validId(result.user_id)) {
            throw createError.NotFound("Invalid user id")
        }
        let _id = mongoose.Types.ObjectId(result.user_id);

        const user = await User.findOne({_id})

        if (!user) {
            throw createError.NotFound('User not registered')
        }

        let options = {
            min: 100000
            , max: 999999
            , integer: true
        }

        let otp = rn(options)

        await User.updateOne({_id}, {number: result.mobile_number, otp});

        res.send({
            error: false,
            message: 'Resend otp',
            code: 200,
            otp
        })

    } catch (e) {
        if (e.isJoi === true) e.status = 422
        next(e)
    }
}
exports.Post_ForgotPassword = async (req, res, next) => {
    try {

        const result = await Validation.ForgotPassword.validateAsync(req.body);

        const user = await User.findOne({email: result.email})

        if (!user) {
            throw createError.NotFound('User not registered')
        }

        let options = {
            min: 100000
            , max: 999999
            , integer: true
        }

        let otp = rn(options)

        await User.updateOne({_id: user._id}, {otp});


        res.send({
            error: false,
            message: 'verify user',
            code: 200,
            user
        })

    } catch (e) {
        if (e.isJoi === true) e.status = 422
        next(e)
    }
}
exports.Post_ResetPassword = async (req, res, next) => {
    try {

        const result = await Validation.ResetPassword.validateAsync(req.body);

        if (!validId(result.user_id)) {
            throw createError.NotFound("Invalid user id")
        }
        let _id = mongoose.Types.ObjectId(result.user_id);


        const user = await User.findOne({$and: [{_id}, {email: result.email}]})

        if (!user) {
            throw createError.NotFound('User not registered')
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(result.password, salt);

        let change_users_pass = await User.findOneAndUpdate({_id}, {password: hashedPassword});

        res.send({
            error: false,
            message: 'verify user',
            code: 200,
            user: change_users_pass
        })

    } catch (e) {
        if (e.isJoi === true) e.status = 422
        next(e)
    }
}
exports.Notification = async (req, res, next) => {
    try {

        const notification = await Notification.find().sort({created_at: -1})

        res.send({
            error: false,
            message: 'Notification list',
            code: 200,
            notification
        })

    } catch (e) {
        next(e)
    }
}
exports.Post_CategoriesProduct = async (req, res, next) => {
    try {

        const result = await Validation.CategoriesProduct.validateAsync(req.body);

        if (!validId(result.categories_id)) {
            res.status(200).send({error: true, message: "Invalid object id"})
        }

        let _id = mongoose.Types.ObjectId(result.categories_id)

        let CategoriesProduct = await Product.find({$and: [{status: true}, {"categories.cat_id": _id}, {"categories.position": 1}]}, {purchase_price: 0}).sort({created_at: -1})

        res.send({
            error: false,
            message: 'Category Product list',
            code: 200,
            Products: CategoriesProduct
        })

    } catch (e) {
        next(e)
    }
}
exports.Post_SubCategoriesProduct = async (req, res, next) => {
    try {

        const result = await Validation.SubCategoriesProduct.validateAsync(req.body);

        if (!validId(result.subCategories_id)) {
            res.status(200).send({error: true, message: "Invalid object id"})
        }

        let _id = mongoose.Types.ObjectId(result.subCategories_id)

        let SubCategoriesProduct = await Product.find({$and: [{status: true}, {"categories.cat_id": _id}, {"categories.position": 2}]}, {purchase_price: 0}).sort({created_at: -1})

        res.send({
            error: false,
            message: 'Sub Category Product list',
            code: 200,
            Products: SubCategoriesProduct
        })

    } catch (e) {
        next(e)
    }
}
exports.Post_SimilarProduct = async (req, res, next) => {
    try {

        const result = await Validation.SimilarProduct.validateAsync(req.body);

        const similar_product = await Product.find({$and: [{keyword: result.keyword}, {status: true}]}, {purchase_price: 0})

        res.send({
            error: false,
            message: 'Similar product list',
            code: 200,
            similar_product
        })

    } catch (e) {
        next(e)
    }
}
exports.Post_SearchProduct = async (req, res, next) => {
    try {

        const result = await Validation.SearchProduct.validateAsync(req.body);

        const product = await Product.find({$and: [{name: result.product_name}, {status: true}]}, {purchase_price: 0})

        res.send({
            error: false,
            message: 'Search Product list',
            code: 200,
            product
        })

    } catch (e) {
        next(e)
    }
}
exports.Post_AddAddress = async (req, res, next) => {
    try {

        const result = await Validation.AddAddress.validateAsync(req.body);

        let state = {}
        state.state_id = result.state_id
        state.state_name = result.state_name

        let city = {}
        city.city_id = result.city_id
        city.city_name = result.city_name


        const address = await new Address({
            user_id: result.user_id,
            name: result.name,
            number: result.number,
            state: state,
            city: city,
            address: result.address,
        })

        await address.save()

        res.send({
            error: false,
            message: 'Search Product list',
            code: 200,
        })

    } catch (e) {
        next(e)
    }
}
exports.Post_Address = async (req, res, next) => {
    try {

        const result = await Validation.Address.validateAsync(req.body);

        if (!validId(result.user_id)) {
            res.status(200).send({error: true, message: "Invalid object id"})
        }

        let _id = mongoose.Types.ObjectId(result.user_id)

        const address = await Address.find({user_id: _id})

        res.send({
            error: false,
            message: 'User address list',
            code: 200,
            address
        })

    } catch (e) {
        next(e)
    }
}
exports.Post_Profile = async (req, res, next) => {
    try {

        const result = await Validation.Profile.validateAsync(req.body);

        if (!validId(result.user_id)) {
            res.status(200).send({error: true, message: "Invalid object id"})
        }

        let _id = mongoose.Types.ObjectId(result.user_id)

        const user = await User.find({_id})

        res.send({
            error: false,
            message: 'User address list',
            code: 200,
            user
        })

    } catch (e) {
        next(e)
    }
}
exports.Post_AddReview = async (req, res, next) => {
    try {

        const result = await Validation.Review.validateAsync(req.body);

        if (!validId(result.user_id)) {
            res.status(200).send({error: true, message: "Invalid user id"})
        }

        if (!validId(result.product_id)) {
            res.status(200).send({error: true, message: "Invalid product id"})
        }

        let user_id = mongoose.Types.ObjectId(result.user_id)
        let product_id = mongoose.Types.ObjectId(result.product_id)

        const review = await Review({
            user_id: user_id,
            product_id: product_id,
            review: result.review,
            comment: result.comment,
        })

        await review.save()

        res.send({
            error: false,
            message: 'successfully create',
            code: 200,
        })

    } catch (e) {
        next(e)
    }
}
exports.Post_Review = async (req, res, next) => {
    try {

        const result = await Validation.Review.validateAsync(req.body);

        if (!validId(result.product_id)) {
            res.status(200).send({error: true, message: "Invalid product id"})
        }

        let product_id = mongoose.Types.ObjectId(result.product_id)

        const review = await Review.find({product_id: product_id})

        await review.save()

        res.send({
            error: false,
            message: 'successfully create',
            code: 200,
            review
        })

    } catch (e) {
        next(e)
    }
}
exports.Post_ChangePassword = async (req, res, next) => {
    try {

        const result = await Validation.ChangePassword.validateAsync(req.body);

        if (!validId(result.user_id)) {
            res.status(200).send({error: true, message: "Invalid product id"})
        }

        let _id = mongoose.Types.ObjectId(result.user_id)

        const user = await User.findOne({_id})

        let doesMatchPsw = await bcrypt.compare(result.old_password, user.password);

        if (!doesMatchPsw) {
            throw createError(403, 'old password not match')
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(result.new_password, salt);

        let change_users_pass = await User.findOneAndUpdate({_id}, {password: hashedPassword});


        res.send({
            error: false,
            message: 'successfully password change',
            code: 200,
            user: change_users_pass
        })

    } catch (e) {
        next(e)
    }
}
exports.VersionControl = async (req, res, next) => {
    try {

        const version = await VersionControl.find();

        res.send({
            error: false,
            message: 'Version control',
            code: 200,
            version
        })

    } catch (e) {
        next(e)
    }
}
exports.Post_OrderPlace = async (req, res, next) => {

    try {

        const result = await Validation.Order.validateAsync(req.body);

        const {
            payment_method,
            user_id,
            user_email,
            user_number,
            address_id,
            user_address,
            coupon,
            product,
            sub_total_amt,
            total_amt,
            shipping_amt,
            payment_status
        } = result;


        /* User Address */
        let UserAddress = {};
        UserAddress.address_id = address_id
        UserAddress.user_address = user_address

        let SellerIdsArray = []
        for (const sId of product) {
            let sellerIds = SellerIdsArray.find(element => element === sId.seller_id.toString().trim())
            if (sellerIds === undefined) {
                SellerIdsArray.push(sId.seller_id.toString().trim())
            }
        }

        let Orders = []
        for (const sellerIdsArrayElement of SellerIdsArray) {
            if (!validId(sellerIdsArrayElement)) {
                return next(createError.BadRequest("Seller id invalid"));
            }
            let Products = []
            for (const pro of product) {

                if (pro.seller_id.toString().trim() === sellerIdsArrayElement.toString().trim()) {

                    if (!validId(pro.product_id)) {
                        return next(createError.BadRequest("Product id invalid"));
                    }

                    let productIds = mongoose.Types.ObjectId(pro.product_id);

                    /* Product */
                    let product = await Product.findOne({product_id: productIds}, {current_stock: 1, user_id: 1});
                    let currentStock = parseInt(product.current_stock) - parseInt(pro.product_qty);
                    await Product.updateOne({_id: productIds}, {current_stock: currentStock});

                    /* Stock */
                    let stock = await Stock.findOne({product_id: productIds});
                    let currentStocks = parseInt(stock.current_stock) - parseInt(pro.product_qty);
                    let remainingStocks = 0;
                    let sellOut = stock.sell_out + parseInt(pro.product_qty);
                    let sellOutAmt = parseInt(stock.sell_out_amt) + parseInt(pro.product_amt);
                    await Stock.updateOne({product_id: productIds}, {
                        current_stock: currentStocks,
                        remaining_stock: remainingStocks,
                        sell_out: sellOut,
                        sell_out_amt: sellOutAmt
                    })
                    Products.push(pro)
                }
            }
            let order = new Order({
                seller_id: sellerIdsArrayElement,
                order_id: "ORDER123456",
                payment_method: payment_method,
                user_id: user_id,
                user_email: user_email,
                user_number: user_number,
                user_address: UserAddress,
                product: Products,
                coupon: coupon,
                sub_total_amt: sub_total_amt,
                total_amt: total_amt,
                shipping_amt: shipping_amt,
                payment_status: payment_status
            });
            Orders.push(order)
            await order.save()
        }

        res.send({
            error: false,
            message: 'order place successfully',
            code: 200,
            order: Orders
        })


    } catch (e) {
        next(e)
    }

}


function validId(id) {
    let checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")
    return checkForHexRegExp.test(id);
}








































