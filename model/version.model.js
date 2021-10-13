const {Schema, model} = require("mongoose");

const VersionControlSchema = new Schema({
    old_version : {type: Number, require: true},
    new_version : {type: Number, require: true},
    created_at: {type: Date, default: new Date()},
});

module.exports = model('version', VersionControlSchema);
