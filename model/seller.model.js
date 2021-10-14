const {Schema, model} = require("mongoose");
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');


const SellerSchema = new Schema({
    f_name : {type: String, require: true},
    l_name : {type: String, require: true},
    phone_number : {type: Number, default: 0},
    email : {type: String, require: true, lowercase: true},
    password : {type: String, require: true},
    image : {type: String, require: true , default : null},
    auth : {type: Boolean , default : false},
    token : {type: String , default: null},
    bank_name : {type: String, require: true , default : null},
    branch : {type: String, require: true , default : null},
    account_no : {type: Number, require: true , default : null},
    holder_name : {type: String, require: true , default : null},
    status: {type: Boolean, default: true},
    created_at: {type: Date, default: new Date()},
});


SellerSchema.pre('save', async function (next) {
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

SellerSchema.pre('updateOne', async function (next) {
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

SellerSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw createHttpError.InternalServerError(error.message);
    }
};



module.exports = model('seller', SellerSchema);
