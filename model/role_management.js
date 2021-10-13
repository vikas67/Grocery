const {Schema, model} = require("mongoose");
const bcrypt = require('bcrypt');

const AdminRoleSchema = new Schema({
    role_name: {type: String, require: true, lowercase: true},
    module_access: {type: Array, require: true},
    status: {type: String, default: true},
    created_at: {type: String, require: true},
    updated_at: {type: String, require: true}
});


module.exports = model('admin_role', AdminRoleSchema);


