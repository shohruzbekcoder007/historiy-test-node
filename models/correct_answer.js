const Joi = require('joi');
const mongoose = require('mongoose');

const CorrectAnswerSchema = new mongoose.Schema({
  test_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tests",
  },
  answer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "answers",
  }
});

const CorrectAnswer = mongoose.model('correct_answers', CorrectAnswerSchema);

function validateCorrectAnswer(answer) {
  const schema = Joi.object({
    test_id: Joi.string().required(),
    answer_id: Joi.string().required(),
  });

  return schema.validate(answer);
}

function validateCorrectAnswerArray(answers) {

  const schema = Joi.array().items(
    Joi.object({
      test_id: Joi.string().required(),
      answer_id: Joi.string().required(),
    }));

  return schema.validate(answers);
  
}

exports.CorrectAnswer = CorrectAnswer;
exports.validate = validateCorrectAnswer;
exports.validateArray = validateCorrectAnswerArray;