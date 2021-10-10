const {Schema, model} = require("mongoose");

const ProductSchema = new Schema({
    added_by : {type: String, require: true , default :'admin'},
    name : {type: String, require: true},
    slug : {type: String, require: true},
    unit : {type: String, require: true , ref : "KG , Gram"},
    thumbnail : {type: String, require: true},
    image : {type: Array, require: true},
    categories : {type: Array, require: true},
    unit_price : {type: Number, require: true},
    purchase_price : {type: Number, require: true},
    discount : {type: String, require: true},
    discount_type : {type: String, require: true},
    current_stock : {type: Number, require: true},
    details : {type: String, require: true},
    keyword : {type: String , ref : "keyword similar product" , default : null},
    status: {type: Boolean, default: true},
    created_at: {type: Date, default: new Date()},
});

module.exports = model('product', ProductSchema);
