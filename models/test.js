const Joi = require('joi');
const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    text_question: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "queries",
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
    }
});

const Test = mongoose.model('test', testSchema);

function validateTest(question) {
  const schema = Joi.object({
    question_text: Joi.string().required(),
  });

  return schema.validate(question);
}

exports.Test = Test;
exports.validate = validateTest;

