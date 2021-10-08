const {Schema, model} = require("mongoose");

const AddressSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: "user_id", require: true},
    name: {type: String, require: true},
    number: {type: Number, require: true},
    state: [
        {
            state_id: {type: Schema.Types.ObjectId, ref: "State id", require: true},
            state_name: {type: String, require: true}
        }
    ],
    city: [
        {
            city_id: {type: Schema.Types.ObjectId, ref: "City id", require: true},
            city_name: {type: String, require: true}
        }
    ],
    address: {type: String, require: true},
    status: {type: Boolean, default: true, require: true},
    created_at: {type: Date, default: new Date()},
});

module.exports = model('address', AddressSchema);
