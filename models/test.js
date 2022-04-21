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
    level: {
        type: Number,
        required: true
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
    level: Joi.number().required(),
  });

  return schema.validate(question);
}

exports.Test = Test;
exports.validate = validateTest;

