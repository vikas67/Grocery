const {Schema, model} = require("mongoose");

const KeywordSchema = new Schema({
    name : {type: String, require: true},
    slug : {type: String, require: true},
    status: {type: Boolean, default: false},
    created_at: {type: Date, default: new Date()},
});

module.exports = model('keyword', KeywordSchema);
