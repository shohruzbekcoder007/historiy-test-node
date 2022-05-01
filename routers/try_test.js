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
    
    let try_test = new TryTest(_.pick(req.body, ['name',"category_id"]));
    let new_try_test = await try_test.save();
    res.status(201).send(_.pick(new_try_test, ['_id', 'name',"category_id"]));

});

router.get('/list', [auth, admin, newtoken], async (req, res) => {
    
    let category_id = req.query.category_id || "";

    console.log(req.query,category_id)

    if(!category_id)
        return res.status(400).send("Bunday Category mavjud emas")

    let try_tests = await TryTest.find({category_id: category_id})
                             .populate('category_id', 'name')
                             .exec();
    res.send(try_tests);

});

module.exports = router;