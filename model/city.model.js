const {Schema, model} = require("mongoose");

const CitySchema = new Schema({
    name : {type: String, require: true},
    slug : {type: String, require: true},
    state_id : {type: Schema.Types.ObjectId , ref : "state Id" , default : null},
    status: {type: Boolean, default: false},
    created_at: {type: Date, default: new Date()},
});

module.exports = model('city', CitySchema);
