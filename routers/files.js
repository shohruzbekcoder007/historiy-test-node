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
const { User } = require('../models/user')
const { MessageGroup } = require('../models/message_group')

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

router.post('/uploadfilemessage', [auth, admin, upload_file.single('file'), newtoken], async (req, res) => {

    if(req.file === undefined) return res.send("file tanlang")
    
    const imageUrl = `http://localhost:8080/v1/file/${req.file.filename}`

    const { to_message } = req.body

    if(!to_message){
        return res.status(404).send("Guruh yoki shaxs tanlanmagan")
    } else {
        const context_message = imageUrl
        const from_message = req.user._id
        const type_message = 'file'

        let group_message = new MessageGroup({
            context_message,
            from_message,
            type_message,
            to_message
        });

        let newgroup_message = await group_message.save();
        return res.send(newgroup_message)
    }
    
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

router.post('/uploadvideomessage', [auth, admin, upload_video.single('file'), newtoken], async (req, res) => {

    if(req.file === undefined) return res.send("file tanlang")
    
    const imageUrl = `http://localhost:8080/v1/file/${req.file.filename}`

    const { to_message } = req.body

    if(!to_message){
        return res.status(404).send("Guruh yoki shaxs tanlanmagan")
    } else {
        const context_message = imageUrl
        const from_message = req.user._id
        const type_message = 'video'

        let group_message = new MessageGroup({
            context_message,
            from_message,
            type_message,
            to_message
        });

        let newgroup_message = await group_message.save();
        return res.send(newgroup_message)
    }
    
})

router.post('/uploadimg', [auth, upload.single('file'), newtoken], async (req, res) => {

    if(req.file === undefined) return res.send("file tanlang")
    
    const imageUrl = `http://localhost:8080/v1/file/${req.file.filename}`

    const user_id = req.user._id

    await User.findOneAndUpdate({_id: user_id}, { $set: {profile_img: imageUrl} })

    return res.send(imageUrl)
    
})

router.post('/uploadimgmessage', [auth, upload.single('file'), newtoken], async (req, res) => {

    if(req.file === undefined) return res.send("file tanlang")
    
    const imageUrl = `http://localhost:8080/v1/file/${req.file.filename}`

    const { to_message } = req.body

    if(!to_message){
        return res.status(404).send("Guruh yoki shaxs tanlanmagan")
    } else {
        const context_message = imageUrl
        const from_message = req.user._id
        const type_message = 'image'

        let group_message = new MessageGroup({
            context_message,
            from_message,
            type_message,
            to_message
        });

        let newgroup_message = await group_message.save();
        return res.send(newgroup_message)
    }
    
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