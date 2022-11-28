const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const config = require('config')

const storage = new GridFsStorage({
    url: config.get('db'),
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useNewUrlParser:true
    },
    file: (req, file) => {
        const match = ["audio/x-wav", "audio/x-aiff", "audio/x-aiff", "audio/mpeg", "audio/wave"]

        if(match.indexOf(file.mimetype) === -1){
            const filename = `${Date.now()}-any-name-${file.originalname}`
            return filename
        }
        return {
            bucketName: "photos",
            filename: `${Date.now()}-any-name-${file.originalname}`
        }
    }
})

module.exports = multer({ storage })