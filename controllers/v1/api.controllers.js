const mongoose = require('mongoose');
const slugify = require('slugify')
const Validation = require('../../util/ApiValidationSchema')
const moment = require('moment');
const createError = require('http-errors')

/*  JWT  */
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../../util/jwt.helper')

/*  MODEL */
const User = require('../../model/user.model');
const Categories = require('../../model/categories.model.model');

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
        )

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

        const result = await Validation.subCategories(req.body);


        const subCategories = await Categories.find(
            {
                $and: [
                    {position: 2},
                    {status: true},
                    {parent_id: result.categories_id}
                ]
            }
        )

        res.send({
            error: false,
            message: 'sub categories list',
            code: 200,
            sub_categories: subCategories
        })

    } catch (e) {
        next(e)
    }
}


