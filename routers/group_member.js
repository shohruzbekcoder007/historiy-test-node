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

    if(req.body.status){
        req.body.status = false
    }

    const { error } = validate(req.body);
    
    if(error)
        return res.status(400).send(error.details[0].message);
    
    try{
        let member = new Member(_.pick(req.body, ['student_id', 'group_id', 'teacher_id']));
        let newmember = await member.save();
        return res.status(201).send(_.pick(newmember, ['group_id']));
    }catch(err){
        return res.status(404).send("So'rovingizni jo'natishing imkoni bo'lmadi!");
    }

});

router.get('/member', [auth, newtoken], async (req, res) => {
    let student_id = req.user._id
    let status = req.params.status || true
    try{
        let member = await Member.find({student_id: student_id, status: status});
        return res.send(member);
    }catch(err){
        return res.status(404).send("Xatolik yuzaga keldi!!!");
    }

})

router.get('/requeststoteacher', [auth, admin, newtoken], async (req, res) => {
    let teacher_id = req.user._id
    let req_to_teacher = await Member.find({teacher_id: teacher_id, status: false})
    res.send(req_to_teacher)
})

router.post('/resforstudent', [auth, admin, newtoken], async (req, res) => {
    
    if(req.body.req_id){
        let _id = req.body.req_id
        const member_req = await Member.findByIdAndUpdate(_id, {status: true})
        res.send(member_req)
    } else {
        res.status(404).send("So'rovning _id si ko'rsatilmagan")
    }
})


module.exports = router;