const { Test, validate } = require('../models/test');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const newtoken = require('../middleware/newtoken');

router.post('/', [auth, admin, newtoken], async (req, res) => {

    const { error } = validate(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);
    
    try{
        let test = new Test(_.pick(req.body, ['text_question',"test_answer1","test_answer2","test_answer3","test_answer4","try_test_id"]));
        let newtest = await test.save();
        res.status(201).send(_.pick(newtest, ['_id', 'text_question',"test_answer1","test_answer2","test_answer3","test_answer4",,"try_test_id"]));
    }catch(err){
        res.status(404).send("Ushbu testni saqlashning imkoni bo'lmadi");
    }

});

router.get('/list', [auth, newtoken], async (req, res) => {
    try{
        let tests = await Test.find({"try_test_id" : req.query.try_test_id})
                              .populate('text_question', 'question_text')
                              .populate('test_answer1', 'answer_text')
                              .populate('test_answer2', 'answer_text')
                              .populate('test_answer3', 'answer_text')
                              .populate('test_answer4', 'answer_text')
                              .populate('try_test_id', 'name')
                              .exec()
        return res.status(200).send(tests);
    }catch(err){
        return res.status(404).send("Savollar ro'yxati topilmadi");
    }
});

module.exports = router;