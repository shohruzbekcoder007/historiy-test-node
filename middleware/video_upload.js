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
        const match = ["video/mp4", "video/mov", "video/mkv", "video/wmv", 'video/gif', 'video/ogg', 'video/wmv', 'video/x-flv', 'video/avi', 'video/webm', 'video/avchd']

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