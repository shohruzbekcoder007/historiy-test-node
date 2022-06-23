const express = require('express')
const router = express.Router()
const _ = require('lodash')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const newtoken = require('../middleware/newtoken')
const { Category, validate } = require('../models/category')

router.post('/', [auth, admin, newtoken], async (req, res) => {
    
    req.body.user_id = req.user._id;

    const { error } = validate(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);
        
    let category = new Category(_.pick(req.body, ['name',"user_id"]));
    let newcategory = await category.save();
    
    return res.status(201).send(_.pick(newcategory, ['_id', 'name']));
    
});

router.get('/mycategories', [auth, admin, newtoken], async (req, res) => {
    
    let categories = await Category.find({user_id: req.user._id}).select("_id name");
    return res.send(categories);

});

module.exports = router;