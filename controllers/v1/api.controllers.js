var mongoose = require('mongoose');
const slugify = require('slugify')
const Validation = require('../../util/validation_schema')
var moment = require('moment');
const createError = require('http-errors')

/*  JWT  */
const {signAccessToken , signRefreshToken , verifyRefreshToken} = require('../../util/jwt.helper')

/*  START MODEL */

const User = require('../../model/user.model');

/*  END MODEL */

exports.Post_Register = async (req , res , next) => {

    try {
        
        
        const result = await Validation.register.validateAsync(req.body)

        console.log(result);

        const doesExist = await User.findOne({ email: result.email })
        if (doesExist){
          throw createError.Conflict(`${result.email} is already been registered`)
        }

                
        const users = {
          name : result.username,
          email : result.email,
          password : result.password        
        }

        const user = new User(users)
        const savedUser = await user.save()
                
        const accessToken = await signAccessToken(savedUser.id)   
        const refreshToken = await signRefreshToken(savedUser.id)   
        
        res.send({
            error : false,
            message : 'register successfully',
            code : 200,
            user : savedUser,
            accessToken,
            refreshToken
        })

    } catch (error) {
    
        if (error.isJoi === true) error.status = 422
        next(error)

    }

}


exports.Post_Login = async (req , res , next) => {

  try {
      
      const result = await Validation.login.validateAsync(req.body)

      const user = await User.findOne({ email: result.email })

      if (!user) throw createError.NotFound('User not registered')

      const isMatch = await user.isValidPassword(result.password)
      if (!isMatch)
        throw createError.Unauthorized('Username/password not valid')

      const accessToken = await signAccessToken(user.id)
      const refreshToken = await signRefreshToken(user.id)   

      res.send({ accessToken , refreshToken ,  user})

  } catch (error) {
    if (error.isJoi === true) return next(createError.BadRequest('Invalid Username/Password'))
    next(error)
  }

}


exports.Post_Refresh_token = async (req , res , next) => {
  
  const { refreshToken } = req.body
  if (!refreshToken) throw createError.BadRequest()
  const userId = await verifyRefreshToken(refreshToken)

  const accessToken = await signAccessToken(userId)
  const refToken = await signRefreshToken(userId)
  res.send({ accessToken: accessToken, refreshToken: refToken })

}

exports.Category = async (req , res , next) => {
  res.send("cdscdc")
}


