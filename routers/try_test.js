const { TryTest, validate } = require('../models/try_test');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const newtoken = require('../middleware/newtoken');

router.post('/', [auth, admin, newtoken], async (req, res) => {

    const { error } = validate(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);
    
    let try_test = new TryTest(_.pick(req.body, ['name',"group_id"]));
    let new_try_test = await try_test.save();
    return res.status(201).send(_.pick(new_try_test, ['_id', 'name',"group_id"]));

});

router.get('/list', [auth, admin, newtoken], async (req, res) => {
    
    let group_id = req.query.group_id || "";

    if(!group_id)
        return res.status(400).send("Bunday Category mavjud emas")

    let try_tests = await TryTest.find({group_id: group_id})
                             .populate('group_id', 'name')
                             .exec();
    return res.send(try_tests);

});

module.exports = router;