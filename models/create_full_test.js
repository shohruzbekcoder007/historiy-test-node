const Joi = require("joi");

function validateFullTest(fullTest) {
    const schema = Joi.object({
        text_question: {
            question_text: Joi.string().min(3).required(),
        },
        test_answer1: {
            answer_text: Joi.string().min(3).required(),
            accuracy: Joi.boolean().required()
        },
        test_answer2: {
            answer_text: Joi.string().min(3).required(),
            accuracy: Joi.boolean().required()
        },
        test_answer3: {
            answer_text: Joi.string().min(3).required(),
            accuracy: Joi.boolean().required()
        },
        test_answer4: {
            answer_text: Joi.string().min(3).required(),
            accuracy: Joi.boolean().required()
        }
    });

    return schema.validate(fullTest);
}

function validateFullQuestion(fullQuestion){
    const schema = Joi.object({
        question_text: Joi.string().min(3).required(),
    });

    return schema.validate(fullQuestion);
}

function answerValidate(fullAnswer){
    const schema = Joi.object({
        answer_text: Joi.string().min(3).required(),
        accuracy: Joi.boolean().required()
    });

    return schema.validate(fullAnswer);
}

exports.validateFullTest = validateFullTest;
exports.questionValidate = validateFullQuestion;
exports.answerValidate = answerValidate;