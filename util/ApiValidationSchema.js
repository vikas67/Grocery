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



























