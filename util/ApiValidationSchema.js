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
    categories_id : Joi.string().required()
})

exports.RegisterNumber = Joi.object({
    user_id : Joi.string().required(),
    mobile_number : Joi.number().required()
})


exports.VerifyOtp = Joi.object({
    user_id : Joi.string().required(),
    otp : Joi.number().required()
})

exports.ResendOtp = Joi.object({
    user_id : Joi.string().required()
})


exports.ForgotPassword = Joi.object({
    email: Joi.string().email().lowercase().required()
})

exports.ResetPassword = Joi.object({
    user_id : Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required()
})

exports.SubCategoriesProduct = Joi.object({
    subCategories_id : Joi.string().required()
})
exports.CategoriesProduct = Joi.object({
    categories_id : Joi.string().required()
})

exports.SimilarProduct = Joi.object({
    keyword : Joi.string().required()
})

exports.SearchProduct = Joi.object({
    product_name : Joi.string().required()
})

exports.AddAddress = Joi.object({
    user_id : Joi.string().required(),
    name : Joi.string().required(),
    number : Joi.number().required(),
    state_id : Joi.string().required(),
    state_name : Joi.string().required(),
    city_id : Joi.string().required(),
    city_name : Joi.string().required(),
    address : Joi.string().required(),
})


exports.Address = Joi.object({
    user_id : Joi.string().required()
})

exports.Profile = Joi.object({
    user_id : Joi.string().required()
})

exports.AddReview = Joi.object({
    user_id : Joi.string().required(),
    product_id : Joi.string().required(),
    review : Joi.number().required(),
    comment : Joi.string().required(),
})

exports.Review = Joi.object({
    product_id : Joi.string().required(),
})

exports.ChangePassword = Joi.object({
    user_id : Joi.string().required(),
    old_password : Joi.string().required(),
    new_password : Joi.string().required(),
})

























