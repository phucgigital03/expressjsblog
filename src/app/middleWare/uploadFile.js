const path = require('path');
const multer = require('multer')

const dir = path.join('/Users/phucnguyen/Documents/wspaceSerVer/expressjs/src','public','img')

const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null,dir)
    },
    filename(req,file,cb){
        const ext = path.extname(file.originalname)
        cb(null,Date.now() + '-' + Math.round(Math.random() * 1E9) + ext)
    }
})

const upload = multer({
    fileFilter(req,file,cb){
        if(
            file.mimetype === 'image/png' || 
            file.mimetype === 'image/jpg'
        ){
            cb(null,true)
        }else{
            cb(null,false)
        }
    },
    limits: {
        fileSize: 2*1024*1024
    },
    storage,
})
module.exports = upload
