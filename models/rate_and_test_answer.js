const Joi = require('joi');
const mongoose = require('mongoose');

const fullTestSchema = new mongoose.Schema({
  test_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tests",
    required: true,
    unique: true,
  },
  reight_answer_number: {
    type: Number,
    default: 0,
  },
  reight_answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "answers"
  }
});

const FullTest = mongoose.model('full_test', fullTestSchema);

function validateAnswerAndTest(full_test) {
  const schema = Joi.object({
    test_id: Joi.string().required(),
    reight_answer_number: Joi.number(),
    reight_answer: Joi.string().required()
  });

  return schema.validate(full_test);
}

exports.FullTest = FullTest;
exports.validate = validateAnswerAndTest;