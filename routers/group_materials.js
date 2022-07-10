const { Material, validate } = require('../models/group_materials')
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const newtoken = require('../middleware/newtoken')
const { Group } = require('../models/group')

router.post('/', [auth, admin, newtoken], async (req, res) => {

    const teacher_id = req.user._id
    const { group_id, material_url } = req.body

    const { error } = validate({teacher_id, group_id, material_url});
    
    if(error)
        return res.status(400).send(error.details[0].message);

    const group = await Group.findById(group_id)
        
    if(group && group.teacher_id === teacher_id){

        const material = new Material({teacher_id, group_id, material_url})
        const new_material = await material.save()
        const update_group = await Group.findByIdAndUpdate(group._id, {number_of_maretials: group.number_of_maretials + 1})

        res.send({new_material, update_group})
    }else{
        res.send("So'rovingizni bajarishning imkoni bo'lmadi")
    }
    
});

module.exports = router;