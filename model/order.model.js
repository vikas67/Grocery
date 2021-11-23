const {Schema, model} = require("mongoose");

const OrderSchema = new Schema({
    seller_id: {type: Schema.Types.ObjectId, ref: 'seller', require: true},
    order_id: {type: String, require: true},
    payment_method: {type: String, ref: "COD , Online", require: true},
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
    product: {type: Array},
    sub_total_amt: {type: Number, require: true},
    total_amt: {type: Number, require: true},
    shipping_amt: {type: Number, require: true},
    payment_status: {
        type: String,
        require: true,
        enum: ['PAID', 'AWAITING AUTHORIZATION', 'PAYMENT FAILED', 'UNPAID'],
        uppercase: true
    },
    shipping_status: {
        type: String,
        require: true,
        default: "PROCESSING",
        enum: ['SHIPPED', 'PROCESSING', 'DELIVERED', 'CANCELLED'],
        uppercase: true
    },
    order_process_status: {
        type: String,
        require: true,
        default: "PENDING",
        enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'RETURNED', 'FAILED', 'CANCELLED'],
        uppercase: true
    },
    status: {type: Boolean, require: true, default: true},
}, {timestamps: true});

module.exports = model('order', OrderSchema);