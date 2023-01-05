const mongoose = require('mongoose');
const Joi = require('joi');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "groups",
        required: true
    }
});

function validateCategory(category) {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        user_id: Joi.string().min(1).required(),
        group_id: Joi.string().min(1).required(),
    });
  
    return schema.validate(category);
  }

const Category = mongoose.model('categories', categorySchema);

exports.Category = Category;
exports.validate = validateCategory;