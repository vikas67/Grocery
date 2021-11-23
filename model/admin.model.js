const {Schema, model} = require("mongoose");
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');


const AdminSchema = new Schema({
        name: {type: String, require: true},
        role: {type: Schema.Types.ObjectId, ref: "role management", require: true},
        number: {type: Number, default: 0},
        email: {type: String, require: true, lowercase: true, unique: true},
        password: {type: String, require: true},
        avatar: {type: String, require: true, default: null},
        roles: {
            type: String,
            enum: ["ADMIN", "SELLER", "EMPLOYEE"],
            def: 'Admin or seller login and employee'
        },
        status: {type: Boolean, default: true}
    },
    {
        timestamps: true
    })


AdminSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});


AdminSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw createHttpError.InternalServerError(error.message);
    }
};


module.exports = model('admin', AdminSchema);
