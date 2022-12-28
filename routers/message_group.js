const { MessageGroup, validate } = require('../models/message_group')
const { UserProfileInfo } = require('../models/user_profile_info')
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const auth = require('../middleware/auth')
const newtoken = require('../middleware/newtoken')

router.post('/', [auth, newtoken], async (req, res) => {
    
    if(!req.body.from_message){
        req.body.from_message = req.user._id
    }

    const { error } = validate(req.body);
    
    if(error)
        return res.status(400).send(error.details[0].message);
    
    try{

        let group_message = new MessageGroup(_.pick(req.body, ['from_message', 'to_message', 'context_message', 'type_message', 'create_date']));
        let newgroup_message = await group_message.save();
        return res.status(201).send(_.pick(newgroup_message, ['_id','from_message', 'to_message', 'context_message', 'type_message', 'create_date']));

    }catch(err){
        return res.status(404).send("do not send");
    }

});

router.get('/', [auth, newtoken], async (req, res) => {
    
    let group_message_id = req.query.group_message_id || ``;
    
    try{
        let message = await MessageGroup.findOne({_id: group_message_id}).populate({path:'from_message', select:'-password'})
        let person = await UserProfileInfo.findOne({user_id: message.from_message})
        message.person = person
        return res.status(201).send(_.pick(message, ['_id','from_message', 'to_message', 'context_message', 'type_message', 'create_date', 'person']));
    }catch(err){
        return res.status(404).send("do not send");
    }

});

router.get('/lastmessages', [auth, newtoken], async (req, res) => {
    
    let to_message = req.query.to_message || ``;
    
    try{
        let messages = await MessageGroup.find({to_message: to_message}).populate({path:'from_message', select:'-password'}).sort({create_date: -1}).limit(10)
        return res.status(201).send(messages);
    }catch(err){
        return res.status(404).send("xatolik yuzaga keldi");
    }
    return res.send([])

});

module.exports = router;