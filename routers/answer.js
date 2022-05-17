const { Answer, validate } = require('../models/answer');
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
        let answer = new Answer(_.pick(req.body, ['answer_text']));
        let newanswer = await answer.save();
        return res.status(201).send(_.pick(newanswer, ['_id', 'answer_text']));
    }catch(err){
        return res.status(404).send("Ushbu javobni saqlashning imkoni bo'lmadi");
    }

});

module.exports = router;