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

module.exports = router;