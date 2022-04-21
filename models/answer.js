const Joi = require('joi');
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  answer_text: {
    type: String,
    required: true,
    minlength: 1
  }
});

const Answer = mongoose.model('answers', answerSchema);

function validateAnswer(answer) {
  const schema = Joi.object({
    answer_text: Joi.string().min(1).required(),
  });

  return schema.validate(answer);
}

exports.Answer = Answer;
exports.validate = validateAnswer;