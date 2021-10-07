const Joi = require('joi')

exports.register = Joi.object({
    username : Joi.string().lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required()
})


exports.login = Joi.object({    
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required()
})

exports.subCategories = Joi.object({
    categories_id : Joi.string().required(),
})

exports.RegisterNumber = Joi.object({
    user_id : Joi.string().required(),
    mobile_number : Joi.number().required(),
})


exports.VerifyOtp = Joi.object({
    user_id : Joi.string().required(),
    otp : Joi.number().required(),
})

exports.ResendOtp = Joi.object({
    user_id : Joi.string().required(),
})


exports.ForgotPassword = Joi.object({
    email: Joi.string().email().lowercase().required(),
})

exports.ResetPassword = Joi.object({
    user_id : Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required()
})



























