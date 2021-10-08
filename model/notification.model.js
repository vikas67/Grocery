const {Schema, model} = require("mongoose");

const NotificationSchema = new Schema({
    title : {type: String , require: true},
    description : {type: String, require: true},
    status: {type: Boolean, default: true},
    created_at: {type: Date, default: new Date()},
});

module.exports = model('notification', NotificationSchema);
