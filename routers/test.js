const { Test, validate } = require('../models/test');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const newtoken = require('../middleware/newtoken');

router.post('/', [auth, admin, newtoken], async (req, res) => {

    const { validateError } = validate(req.body);

    if(validateError)
        return res.status(400).send(error.details[0].message);
    
    try{
        let test = new Test(_.pick(req.body, ['text_question',"test_answer1","test_answer2","test_answer3","test_answer4","level"]));
        let newtest = await test.save();
        res.status(201).send(_.pick(newtest, ['_id', 'text_question',"test_answer1","test_answer2","test_answer3","test_answer4","level"]));
    }catch(err){
        res.status(404).send("Ushbu testni saqlashning imkoni bo'lmadi");
    }

});

router.get('/list', [auth, newtoken], async (req, res) => {
    console.log(req.query.level)
    try{
        let tests = await Test.find({"level" : req.query.level})
                              .populate('text_question', 'question_text')
                              .populate('test_answer1', 'answer_text')
                              .populate('test_answer2', 'answer_text')
                              .populate('test_answer3', 'answer_text')
                              .populate('test_answer4', 'answer_text')
                              .exec()
        return res.status(200).send(tests);
    }catch(err){
        return res.status(404).send("Savollar ro'yxati topilmadi");
    }
});

module.exports = router;