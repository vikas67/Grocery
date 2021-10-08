const mongoose = require('mongoose');
const slugify = require('slugify')
const Validation = require('../../util/ApiValidationSchema')
const moment = require('moment');
const createError = require('http-errors')
const rn = require('random-number');

/*  JWT  */
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../../util/jwt.helper')

/*  MODEL */
const User = require('../../model/user.model');
const Categories = require('../../model/categories.model');
const Notification = require('../../model/notification.model');
const Product = require('../../model/product.model');




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
            req.flash('error', "Invalid object id!");
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

        if(!validId(result.user_id)) {
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
    try{

        const result = await Validation.ForgotPassword.validateAsync(req.body);

        const user = await User.findOne({email : result.email})

        if (!user) {
            throw createError.NotFound('User not registered')
        }

        let options = {
            min: 100000
            , max: 999999
            , integer: true
        }

        let otp = rn(options)

        await User.updateOne({_id : user._id}, {otp});


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
exports.Post_ResetPassword = async (req , res , next) => {
    try{

        const result = await Validation.ResetPassword.validateAsync(req.body);

        if (!validId(result.user_id)) {
            throw createError.NotFound("Invalid user id")
        }
        let _id = mongoose.Types.ObjectId(result.user_id);


        const user = await User.findOne({$and: [{_id}, {email: result.email}]})

        if (!user) {
            throw createError.NotFound('User not registered')
        }



        let change_users_pass = await User.findOneAndUpdate({_id}, {password: result.password});

        res.send({
            error: false,
            message: 'verify user',
            code: 200,
            user : change_users_pass
        })

    } catch (e) {
        if (e.isJoi === true) e.status = 422
        next(e)
    }
}
exports.Notification = async (req , res , next) => {
    try {

        const notification =  await Notification.find().sort({created_at : -1})

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
exports.Post_SubCategoriesProduct = async (req , res, next) => {
    try {

        const result = await Validation.SubCategoriesProduct.validateAsync(req.body);

        if (!validId(result.subCategories_id)) {
            req.flash('error', "Invalid object id!");
            res.status(200).send({error: true, message: "Invalid object id"})
        }

        let _id = mongoose.Types.ObjectId(result.subCategories_id)

        let SubCategoriesProduct = await Product.find({}).sort({created_at : -1})

        res.send({
            error: false,
            message: 'Notification list',
            code: 200,
            Products : SubCategoriesProduct
        })

    } catch (e) {
        next(e)
    }
}






function validId(id) {
    let checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")
    return checkForHexRegExp.test(id);
}








































