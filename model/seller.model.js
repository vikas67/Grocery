const {Schema, model} = require("mongoose");
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');


const SellerSchema = new Schema({
    seller_id: {type: Schema.Types.ObjectId, required: true},
    token: {type: String, default: null},
    bank_name: {type: String, require: true, default: null},
    branch: {type: String, default: null},
    account_no: {type: Number, default: null},
    shop_name: {type: String, require: true},
    shop_address: {type: String, require: true},
    shop_logo: {type: String, require: true},
    status: {type: Boolean, default: true},
}, {timestamps: true});


module.exports = model('seller', SellerSchema);
