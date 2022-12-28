const { Lesson, validate } = require('../models/group_lesson')
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const newtoken = require('../middleware/newtoken')
const { Group } = require('../models/group')

router.post('/', [auth, admin, newtoken], async (req, res) => {

    const teacher_id = req.user._id
    const { group_id, title, description } = req.body



    const { error } = validate({teacher_id, group_id, title, description})
    
    if(error)
        return res.status(400).send(error.details[0].message)

    const group = await Group.findById(group_id)
    
    if(group && group.teacher_id+"" === teacher_id+""){

        const lesson = new Lesson({teacher_id, group_id, title, description})
        const new_lesson = await lesson.save()
        const update_group = await Group.findByIdAndUpdate(group._id, {number_of_maretials: group.number_of_maretials + 1}, { "new": true })

        res.send({new_lesson, update_group})
    }else{
        res.send("So'rovingizni bajarishning imkoni bo'lmadi")
    }
    
});

router.get('/lessons', [auth, admin, newtoken], async (req, res) => {

    const teacher_id = req.user._id
    const { group_id } = req.query

    const lessons = await Lesson.find({
        teacher_id: teacher_id, 
        group_id: group_id
    })

    res.send(lessons)
    
});

router.get('/lessonsforstudent', [auth, newtoken], async (req, res) => {

    const { group_id } = req.query

    const lessons = await Lesson.find({
        group_id: group_id
    })

    res.send(lessons)
    
});

module.exports = router;