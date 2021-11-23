const {Schema, model} = require("mongoose");

const CategoriesSchema = new Schema({
    name: {type: String, require: true},
    slug: {type: String, require: true},
    position: {type: Number, require: true},
    icon: {type: String, require: true, default: null},
    parent_id: {type: Schema.Types.ObjectId, ref: "category", default: null},
    status: {type: Boolean, default: false},
    created_at: {type: Date, default: new Date()},
});

module.exports = model('categories', CategoriesSchema);
