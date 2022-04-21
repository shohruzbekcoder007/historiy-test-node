const Joi = require('joi');
const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  question_text: {
    type: String,
    required: true,
    minlength: 3
  }
});

const Query = mongoose.model('questions', querySchema);

function validateQuestion(question) {
  const schema = Joi.object({
    question_text: Joi.string().min(3).required(),
  });

  return schema.validate(question);
}

exports.Query = Query;
exports.validate = validateQuestion;