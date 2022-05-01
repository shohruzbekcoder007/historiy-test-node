const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const newtoken = require('../middleware/newtoken');
const { CorrectAnswer, validate } = require('../models/correct_answer');

router.post('/', [auth, admin, newtoken], async (req, res) => {

    const { error } = validate(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);
        
    let correct_answer = new CorrectAnswer(_.pick(req.body, ['test_id',"answer_id"]));
    let new_correct_answer = await correct_answer.save();
    
    return res.status(201).send(_.pick(new_correct_answer, ['_id', 'test_id', 'answer_id']));
    
});

router.post('/correct', [auth, newtoken], async (req, res) => {

    const { error } = validate(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);
        
    let answer = await CorrectAnswer.findOne({test_id: req.body.test_id});
    
    if(answer){
        if(answer.answer_id == req.body.answer_id){
            return res.status(200).send("Javobingiz to'g'ri");
        }else{
            return res.status(400).send("Javobingiz noto'g'ri");
        }
    }else{
        return res.status(400).send("Javobingizni tekshirib bo'lmadi");
    }
    
});

module.exports = router;