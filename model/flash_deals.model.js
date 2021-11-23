const {Schema, model} = require("mongoose");


const FlashDealSchema = new Schema({
    title: {type: String, require: true, lowercase: true},
    start_date: {type: Date, require: true},
    end_date : {type: Date, require: true},
    status: {type: Boolean, default: false},
    created_at: {type: Date, default: new Date()},
});


module.exports = model('flash_deal', FlashDealSchema);


