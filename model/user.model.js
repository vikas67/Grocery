const {Schema, model} = require("mongoose");
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');


const UserSchema = new Schema({
    name : {type: String, require: true},
    number : {type: Number, default: 0},
    email : {type: String, require: true, lowercase: true},
    password : {type: String, require: true},
    otp : {type: Number, default: 0},
    auth : {type: Boolean , default : false},
    token : {type: String , default: null},
    status: {type: Boolean, default: true},
    created_at: {type: Date, default: new Date()},
});


UserSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.pre('updateOne', async function (next) {
    try {
        if (this.isNew) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw createHttpError.InternalServerError(error.message);
    }
};



module.exports = model('users', UserSchema);
