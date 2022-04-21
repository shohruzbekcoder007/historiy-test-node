const { FullTest, validate } = require('../models/rate_and_test_answer');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const newtoken = require('../middleware/newtoken');
const { UserInformation } = require('../models/user_information')

router.post('/', [auth, admin, newtoken], async (req, res) => {

    const { validateError } = validate(req.body);

    if(validateError)
        return res.status(400).send(error.details[0].message);
    
    try{
        let fullTest = new FullTest(_.pick(req.body, ['test_id',"reight_answer_number","reight_answer"]));
        let newtest = await fullTest.save();
        res.status(201).send(_.pick(newtest, ['_id', 'test_id',"reight_answer_number","reight_answer"]));
    }catch(err){
        res.status(404).send("Bunday level savoliga javobni biriktirish imkoni bo'lmadi");
    }

});

router.post('/reight', [auth, newtoken], async (req, res) => {

    const { validateError } = validate(req.body);

    if(validateError)
        return res.status(400).send(error.details[0].message);
    
    try{
        let fullTest = await FullTest.findOne({"_id": req.body.test_position_id});
        if (fullTest.reight_answer == req.body.reight_answer && fullTest.test_id == req.body.test_id){
            await FullTest.updateMany({"_id": fullTest._id}, { $set: { reight_answer_number: fullTest.reight_answer_number + 1 }});
            let information = await UserInformation.find({"user_id": req.user._id});
            if(information){
                // update information 
                // for now level and level__reight_answers aren't finished 
                await UserInformation.updateMany({"all_reight_answers": information.all_reight_answers + 1})
            }else{
                // create information
                info = new UserInformation({user_id: req.user._id});
                await info.save();
            }
            return res.status(201).send(_.pick(fullTest, ['test_id',"reight_answer"]));
        }
        return res.status(400).send("Javobingiz xato");
    }catch(err){
        return res.status(404).send("Bunday level savoliga javobni biriktirish imkoni bo'lmadi");
    }

});

module.exports = router;