const { User, validate } = require('../models/user');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const _ = require('lodash');
const Joi = require('joi');
const auth = require('../middleware/auth');
const newtoken = require('../middleware/newtoken');
const { UserProfileInfo } = require('../models/user_profile_info')

const loginValidator = user => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}

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
    console.log(token)
    return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'email', 'name', 'isAdmin']));
});

router.get('/info', auth, async (req, res) => {

    const { _id } = _.pick(req.user, ['_id', 'isAdmin'])
    
    let user = await User.findById(_id);
    if (!user)
        return res.status(400).send('Email yoki parol noto\'g\'ri');
    
    let profile_info = await UserProfileInfo.findOne({user_id: _id})

    let profile = {}
    
    if(profile_info){
        profile = _.pick(profile_info, ['image_url']) || {}
    }

    user.profile = profile;

    const token = user.generateAuthToken();
    return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'email', 'name', 'isAdmin', "image_url", "profile"]));
});

router.put('/update', auth, async (req, res) => {

    const { _id } = _.pick(req.user, ['_id', 'isAdmin'])

    const { error } = loginValidator(_.pick(req.body, ['email', 'password']));
    if(error)
        return res.status(400).send(error.details[0].message);
    
    let user = await User.findByIdAndUpdate(_id, _.pick(req.body, ['email', 'password']));
    if (!user)
        return res.status(400).send('User\'s information is not update');

    const token = user.generateAuthToken();
    return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'email', 'name', 'isAdmin']));
});

router.delete('/remove', auth, async (req, res) => {

    const { _id } = _.pick(req.user, ['_id', 'isAdmin'])
    
    let user = await User.findByIdAndRemove(_id);
    if (!user)
        return res.status(400).send('User\'s information is not remove');

    return res.send(_.pick(user, ['_id', 'email', 'name', 'isAdmin']));
});

router.get('/teachers', auth, async (req, res) => {

    const { page = 1, limit = 10 } = req.query;

    let user = await User.find({"isAdmin": true})
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.count({"isAdmin": true});

    const token = user[0].generateAuthToken();
    return res.header('x-auth-token', token).json({
        teachers: user,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });

});

module.exports = router;