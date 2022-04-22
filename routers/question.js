const { Query, validate } = require('../models/question');
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
        let query = new Query(_.pick(req.body, ['question_text']));
        let newquestion = await query.save();
        res.status(201).send(_.pick(newquestion, ['_id', 'question_text']));
    }catch(err){
        res.status(404).send("Savolingizning matnini saqlashni imkoni bo'lmadi");
    }

});

module.exports = router;