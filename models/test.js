const Joi = require('joi');
const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    text_question: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions",
        required: true
    },
    test_answer1: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "answers",
        required: true
    },
    test_answer2: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "answers",
        required: true
    },
    test_answer3: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "answers",
        required: true
    },
    test_answer4: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "answers",
        required: true
    },
    try_test_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "try_tests",
    }
});

const Test = mongoose.model('tests', testSchema);

function validateTest(question) {
  const schema = Joi.object({
    question_text: Joi.string().required(),
    test_answer1: Joi.string().required(),
    test_answer2: Joi.string().required(),
    test_answer3: Joi.string().required(),
    test_answer4: Joi.string().required(),
    try_test_id: Joi.string().required(),
  });

  return schema.validate(question);
}

exports.Test = Test;
exports.validate = validateTest;

