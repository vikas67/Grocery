const {Schema, model} = require("mongoose");

const ReviewSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: "user_id", require: true},
    product_id : {type: Schema.Types.ObjectId , ref : "Product" , require: true},
    review : {type: Number, require: true , ref : "star review"},
    comment : {type: String, require: true},
    status : {type: Boolean, default : true},
    created_at: {type: Date, default: new Date()},
});

module.exports = model('review', ReviewSchema);
