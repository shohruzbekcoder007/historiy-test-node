const express = require('express')
const router = express.Router()
const _ = require('lodash')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const newtoken = require('../middleware/newtoken')
const { UserProfileInfo, validate } = require('../models/user_profile_info')

// router.post('/', [auth, admin, newtoken], async (req, res) => {
    
// });

// router.get('/', [auth, admin, newtoken], async (req, res) => {

// });

module.exports = router;