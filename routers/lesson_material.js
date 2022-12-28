const express = require('express')
const router = express.Router()
const _ = require('lodash')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const newtoken = require('../middleware/newtoken')
const { LessonMaterial, validateLessonMaterial } = require('../models/lesson_material')

router.post('/', [auth, admin, newtoken], async (req, res) => {
  
    const { error } = validateLessonMaterial(_.pick(req.body, ["title", "lesson_id", "sourse_test_id", "sourse_post_id", "sourse_file_id"]))

    if(error)
        return res.status(400).send(error.details[0].message)

    let material = new LessonMaterial(_.pick(req.body, ["title", "lesson_id", "sourse_test_id", "sourse_post_id", "sourse_file_id"]));
    let newmaterial = await material.save();

    return res.send(newmaterial)
});

router.get('/', [auth, admin, newtoken], async (req, res) => {

});

module.exports = router;