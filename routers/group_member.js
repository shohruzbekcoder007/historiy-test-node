const { Member, validate } = require('../models/group_member')
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const newtoken = require('../middleware/newtoken')
const { Group } = require('../models/group')

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
        let isMember = await Member.find({group_id: req.body.group_id, student_id: req.body.student_id})
        if(isMember.length===0){
            let member = new Member(_.pick(req.body, ['student_id', 'group_id', 'teacher_id']));
            let newmember = await member.save();
            let group = await Group.find({_id: req.body.group_id})
            newmember.group_id = _.pick(group, ['teacher_id', 'group_name'])
            return res.status(200).send({add: true, group : newmember});
        } else {
            return res.send({add: false, message: "Bu guruhga allaqachon azo bo'lgansiz"})
        }
    }catch(err){
        return res.status(404).send("So'rovingizni jo'natishing imkoni bo'lmadi!");
    }

})

router.get('/member', [auth, newtoken], async (req, res) => {
    let student_id = req.user._id
    let status = req.query.status || false
    try{
        let member = await Member.find({student_id: student_id, status: status}).populate('group_id');
        return res.send(member)
    }catch(err){
        return res.status(404).send("Xatolik yuzaga keldi!!!");
    }

})

router.delete('/remove', [auth, newtoken], async (req, res) => {

    const _id = req.body._id

    try{
        if(_id){
            let member = await Member.findByIdAndRemove(_id)
            if (!member)
                return res.status(400).send('User\'s information is not remove')

            return res.send(member)
        } else {
            return res.status(404).send("Guhurni ko'rsatishingiz shart!!!");
        }
    }catch(err){
        return res.status(404).send("Xatolik yuzaga keldi!!!");
    }

})

router.post('/resforstudent', [auth, admin, newtoken], async (req, res) => {
    
    if(req.body.req_id){

        let _id = req.body.req_id
        const { teacher_id, status } = await Member.findOne({_id: _id})

        if(teacher_id === req.user._id && status === false){

            const member_req = await Member.findByIdAndUpdate(_id, {status: true})
            const group = await Group.findOne({_id: member_req.group_id})
            const update_group = await Group.findByIdAndUpdate(group._id, {number_of_students: group.number_of_students + 1})

            res.send(update_group)

        }else{
            res.status(404).send("Guruh sizga tegishli emas yoki allaqachon azolikni qabul qilgansiz")
        }

    } else {
        res.status(404).send("So'rovning _id si ko'rsatilmagan")
    }
})

router.get('/readrequest', [auth, newtoken], async (req, res) => {
    let group = await Member.findOne({_id: req.query._id}).populate('student_id').populate('group_id')
    group.student_id.password = ""
    res.send(group)
})

module.exports = router;