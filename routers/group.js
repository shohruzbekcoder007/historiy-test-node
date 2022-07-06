const { Group, validate } = require('../models/group')
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const newtoken = require('../middleware/newtoken')

router.post('/', [auth, admin, newtoken], async (req, res) => {
    
    if(!req.body.teacher_id){
        req.body.teacher_id = req.user._id
    }

    delete req.body.status;

    const { error } = validate(req.body);
    
    if(error)
        return res.status(400).send(error.details[0].message);
    
    try{
        let group = new Group(_.pick(req.body, ['teacher_id', 'group_name', 'group_text']));
        let newgroup = await group.save();
        return res.status(201).send(_.pick(newgroup, ['group_name', "_id", 'group_text']));
    }catch(err){
        return res.status(404).send("Quyidagi gurihni tashkil qilishni imkoni bo'lmadi!");
    }

});

router.get('/mygroups', [auth, admin, newtoken], async (req, res) => {
    
    try {
        let groups = await Group.find({teacher_id: req.user._id}).sort({ create_date: -1 });
        return res.send(groups);
    } catch (err) {
        return res.status(404).send("Xatolik yuzaga keldi");
    }
    

});

router.get('/allgroups', [auth, newtoken], async (req, res) => {
    
    try {
        let groups = await Group.find().sort({ create_date: -1 });
        return res.send(groups);
    } catch (err) {
        return res.status(404).send("Xatolik yuzaga keldi");
    }
    

});

module.exports = router;