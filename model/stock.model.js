const {Schema, model} = require("mongoose");

const StockSchema = new Schema({
    product_id : {type: Schema.Types.ObjectId , ref : "Product" , require: true},
    current_stock : {type: Number, require: true},
    remaining_stock : {type: Number, require: true},
    sell_out : {type: Number, require: true},
    sell_out_amt : {type: Number, require: true},
    created_at: {type: Date, default: new Date()},
});

module.exports = model('stocks', StockSchema);
