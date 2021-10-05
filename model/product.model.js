const {Schema, model} = require("mongoose");

const ProductSchema = new Schema({
    added_by : {type: String, require: true , default :'admin'},
    name : {type: String, require: true},
    slug : {type: String, require: true},
    thumbnail : {type: String, require: true},
    image : {type: Array, require: true},
    categories : {type: Array, require: true},
    unit : {type: String, require: true},
    unit_price : {type: Number, require: true},
    purchase_price : {type: Number, require: true},
    current_stock : {type: Number, require: true},
    details : {type: String, require: true},
    status: {type: Boolean, default: true},
    created_at: {type: Date, default: new Date()},
});

module.exports = model('product', ProductSchema);
