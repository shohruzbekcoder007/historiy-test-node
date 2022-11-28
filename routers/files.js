const upload = require('../middleware/image_upload')
const upload_file = require('../middleware/file_upload')
const upload_video = require('../middleware/video_upload')
const upload_audio = require('../middleware/audio_upload')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const mongoose = require("mongoose")
const Grid = require('gridfs-stream')
const newtoken = require('../middleware/newtoken')
const { UserProfileInfo, validate } = require('../models/user_profile_info')

let gfs
const conn = mongoose.connection

let bucket
mongoose.connection.on("connected", () => {
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "photos"
  });
})

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('photos')
    console.log("connection made successfully");
})

router.post('/uploadfile', [auth, admin, upload_file.single('file'), newtoken], async (req, res) => {

    if(req.file === undefined) return res.send("file tanlang")
    
    const imageUrl = `http://localhost:8080/v1/file/${req.file.filename}`

    return res.send(imageUrl)
    
})

router.post('/uploadaudio', upload_audio.single('file'), async (req, res) => {

    console.log(req.file)

    if(req.file === undefined) return res.send("file tanlang")
    
    const imageUrl = `http://localhost:8080/v1/file/${req.file.filename}`

    return res.send(imageUrl)
    
})

router.post('/uploadvideo', [auth, admin, upload_video.single('file'), newtoken], async (req, res) => {

    if(req.file === undefined) return res.send("file tanlang")
    
    const imageUrl = `http://localhost:8080/v1/file/${req.file.filename}`

    return res.send(imageUrl)
    
})

router.post('/uploadimg', [auth, upload.single('file'), newtoken], async (req, res) => {

    if(req.file === undefined) return res.send("file tanlang")
    
    const imageUrl = `http://localhost:8080/v1/file/${req.file.filename}`

    const user_id = req.user._id

    const { error } = validate({
        user_id,
        image_url: imageUrl
    });
    if(error)
        return res.status(400).send(error.details[0].message);

    let profileInfo = await UserProfileInfo.findOne({ user_id: user_id });
    if (profileInfo){
        await UserProfileInfo.findByIdAndUpdate(profileInfo._id, {
            user_id,
            image_url: imageUrl
        });
    } else {
        const newProfileInfo = new UserProfileInfo({
            user_id,
            image_url: imageUrl
        });
        await newProfileInfo.save();
    }

    return res.send(imageUrl)
    
})

router.get('/:filename', async (req, res) => {
    const file = await gfs.files.findOne({filename: req.params.filename})
    const readStream = bucket.openDownloadStream(file._id);
    readStream.pipe(res)
})

router.delete('/:filename', [auth, newtoken], async (req, res) => {
    try {
        await gfs.files.deleteOne({filename: req.params.filename})
        res.send("success")
    } catch (error) {
        res.send('file is not deleted')
    }
})

module.exports = router