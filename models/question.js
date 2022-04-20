const Joi = require('joi');
const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  answer_text: {
    type: String,
    required: true,
    minlength: 3
  }
});

const Query = mongoose.model('query', querySchema);

function validateUser(user) {
  const schema = Joi.object({
    answer_text: Joi.string().min(3).required(),
  });

  return schema.validate(user);
}

exports.Query = Query;
exports.validate = validateUser;