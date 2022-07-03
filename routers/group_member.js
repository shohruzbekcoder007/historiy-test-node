const { Member, validate } = require('../models/group_member');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const newtoken = require('../middleware/newtoken');

router.post('/reqforteacher', [auth, newtoken], async (req, res) => {
    
    if(!req.body.student_id){
        req.body.student_id = req.user._id
    }

    const { error } = validate(req.body);
    
    if(error)
        return res.status(400).send(error.details[0].message);
    
    try{
        let member = new Member(_.pick(req.body, ['student_id', 'group_id']));
        let newmember = await member.save();
        return res.status(201).send(_.pick(newmember, ['group_id']));
    }catch(err){
        return res.status(404).send("So'rovingizni jo'natishing imkoni bo'lmadi!");
    }

});

module.exports = router;
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmMxN2ZjMzEyOTljNTlkY2Q4M2QxN2YiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjU2ODQ4MzIzLCJleHAiOjE2NTY4NDg2MjN9.RehcvEBWPt_iKpIi5Q0IICMw8BCvp67FW55mDv6X9x4
// 62c17f861299c59dcd83d17c