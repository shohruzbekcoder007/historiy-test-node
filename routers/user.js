const { User, validate } = require('../models/user');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const _ = require('lodash');
const Joi = require('joi');
const auth = require('../middleware/auth');
const newtoken = require('../middleware/newtoken');

//functions
const loginValidator = user => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}

//routers
router.post('/', async (req, res) => {
    try{
        const { error } = validate(req.body);

        if(error)
            return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });

        if (user)
            return res.status(400).send('Mavjud bo\'lgan foydalanuvchi');

        user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        
        await user.save();

        const token = user.generateAuthToken();
        return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
    }catch{
        return res.status(500).send("xatolik yuzaga keldi")
    }
});

router.post('/login', async (req, res) => {

    const { error } = loginValidator(_.pick(req.body, ['email', 'password']));
    if(error)
        return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send('Email yoki parol noto\'g\'ri');
    
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword)
        return res.status(400).send('Email yoki parol noto\'g\'ri');

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['email', 'name', 'isAdmin']));
});

module.exports = router;