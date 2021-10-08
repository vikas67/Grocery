const {Schema, model} = require("mongoose");

const OrderSchema = new Schema({
    order_id: {type: String, require: true},
    order_type: {type: String, ref: "COD , Online", require: true},
    user_id: {type: Schema.Types.ObjectId, ref: "User", require: true},
    user_email: {type: String, require: true},
    user_number: {type: Number, require: true},
    user_address: {
        address_id: {type: Schema.Types.ObjectId, ref: "Address", require: true},
        user_address: {type: String, require: true}
    },
    coupon: {
        coupon_id: {type: Schema.Types.ObjectId, ref: "Coupan"},
        coupon_discount: {type: Number, ref: "percent"},
        coupon_amount: {type: Number, ref: "discount off"}
    },
    product_id: {type: Schema.Types.ObjectId, ref: "Product", require: true},
    product_name: {type: String, require: true},
    product_qty: {type: Number, require: true},
    product_amt: {type: Number, require: true},
    product_unit: {type: String, require: true, ref: "kg , gram"},
    sub_total_amt: {type: Number, require: true},
    total_amt: {type: Number, require: true},
    shipping_amt: {type: Number, require: true},
    shipping_status: {type: String, require: true, default: "PENDING"},
    sku: {type: String, require: true},
    status: {type: Boolean, require: true, default: true},
    created_at: {type: Date, default: new Date()},
});

module.exports = model('order', OrderSchema);
