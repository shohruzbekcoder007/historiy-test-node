const { Member, validate } = require('../models/group_member');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const newtoken = require('../middleware/newtoken');
const { Group } = require('../models/group');

router.post('/reqforteacher', [auth, newtoken], async (req, res) => {
    
    if(!req.body.student_id){
        req.body.student_id = req.user._id
    }

    if(req.body.status){
        req.body.status = false
    }

    const { error } = validate(req.body);
    
    if(error)
        return res.status(400).send(error.details[0].message);
    
    try{
        let isMember = await Member.find({group_id: req.body.group_id})
        if(isMember.length===0){
            let member = new Member(_.pick(req.body, ['student_id', 'group_id']));
            let newmember = await member.save();
            let group = await Group.find({_id: req.body.group_id})
            console.log(group)
            newmember.group_id = _.pick(group, ['teacher_id', 'group_name'])
            return res.status(200).send({add: true, group : newmember});
        } else {
            return res.send({add: false, message: "Bu guruhga allaqachon azo bo'lgansiz"})
        }
        
        
    }catch(err){
        return res.status(404).send("So'rovingizni jo'natishing imkoni bo'lmadi!");
    }

});

router.get('/member', [auth, newtoken], async (req, res) => {
    let student_id = req.user._id
    let status = req.query.status || false
    try{
        let group = await Member.find({"student_id": student_id, status: ""+status+""}).populate("group_id");
        return res.send(group);
    }catch(err){
        return res.status(404).send("Xatolik yuzaga keldi!!!");
    }

})

// router.get('/reqfromstudent', [auth, admin, newtoken], async (req, res) => {
//     const teacher_id = req.user._id
//     let new_students = await Member.find()group_id, group_id, status
// })

router.post('/restostudent', [auth, admin, newtoken], async (req, res) => {
    
    if(!req.body.student_id){
        req.body.student_id = req.user._id
    }

    if(!req.body.status){
        req.body.status = true
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