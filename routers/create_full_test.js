const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const newtoken = require('../middleware/newtoken');
const {
    validateFullTest,
    questionValidate,
    answerValidate,
} = require('../models/create_full_test');
const { Query } = require('../models/question');
const { Answer } = require('../models/answer');
const { Test, validate } = require('../models/app_test');

router.post('/', [auth, admin, newtoken], async (req, res) => {

    const { error } = validateFullTest(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    if(questionValidate(req.body.text_question || {}).error)
        return res.status(400).send(error.details[0].message);


    if(answerValidate(req.body.test_answer1 || {}).error)
        return res.status(400).send(error.details[0].message);

    
    if(answerValidate(req.body.test_answer2 || {}).error)
        return res.status(400).send(error.details[0].message);

    if(answerValidate(req.body.test_answer3 || {}).error)
        return res.status(400).send(error.details[0].message);

    if(answerValidate(req.body.test_answer4 || {}).error)
        return res.status(400).send(error.details[0].message);

    let haveTestAnswer = false || req.body.test_answer1.accuracy || req.body.test_answer2.accuracy
                                  req.body.test_answer3.accuracy || req.body.test_answer4.accuracy

    if(haveTestAnswer === false){
        return res.status(400).send("To'g'ri javobni kiriting")
    }

    let numberRightAnswer = 0;

    if (req.body.test_answer1.accuracy) {
        numberRightAnswer++
    }
    if (req.body.test_answer2.accuracy) {
        numberRightAnswer++
    }
    if (req.body.test_answer3.accuracy) {
        numberRightAnswer++
    }
    if (req.body.test_answer4.accuracy) {
        numberRightAnswer++
    }

    if (numberRightAnswer != 1) {
        return res.status(400).send("To'g'ri javoblar sonini to'g'ri kiriting")
    }

    try{
        let query = new Query({question_text: req.body.text_question.question_text});
        let newquestion = await query.save();

        let answer1 = new Answer({answer_text: req.body.test_answer1.answer_text});
        let newanswer1 = await answer1.save();

        let answer2 = new Answer({answer_text: req.body.test_answer1.answer_text});
        let newanswer2 = await answer2.save();

        let answer3 = new Answer({answer_text: req.body.test_answer1.answer_text});
        let newanswer3 = await answer3.save();

        let answer4 = new Answer({answer_text: req.body.test_answer1.answer_text});
        let newanswer4 = await answer4.save();

        if(validate({ text_question: newquestion._id, test_answer1: newanswer1._id, test_answer2: newanswer2._id, test_answer3: newanswer3._id, test_answer4: newanswer4._id, try_test_id: req.body.try_test_id}).error)
            return res.status(400).send(error.details[0].message);
        
        let test = new Test({
            text_question: newquestion._id,
            test_answer1: newanswer1._id,
            test_answer2: newanswer2._id,
            test_answer3: newanswer3._id,
            test_answer4: newanswer4._id,
            try_test_id: req.body.try_test_id
        });
        let newtest = await test.save();
        return res.status(201).send(_.pick(newtest, ['_id', 'text_question',"test_answer1","test_answer2","test_answer3","test_answer4",,"try_test_id"]));
    }catch(err){
        return res.status(404).send("Ushbu testni saqlashning imkoni bo'lmadi");
    }

});

module.exports = router;