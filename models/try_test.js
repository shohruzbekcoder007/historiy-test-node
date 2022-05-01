const Joi = require('joi');
const mongoose = require('mongoose');

const trySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
  }
});

const TryTest = mongoose.model('try_tests', trySchema);

function validateTryTest(try_test) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    category_id: Joi.string().required(),
  });

  return schema.validate(try_test);
}

exports.TryTest = TryTest;
exports.validate = validateTryTest;