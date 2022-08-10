const multer = require('multer');
const path = require('path');

let storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/images');
    },
    filename: function (req, file, cb){
        const namaFile = Date.now() + '-'+ file.originalname;
        cb(null, namaFile);
    }
})

let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpg'){
            cb(null, true);
        }else{
            cb(null, false);
            cb(new Error('only png, jpg, and jped allowed to upload!'));
        }
    },
    onError: function (err, next) {
        console.log('error', err);
        next(err);
    }
})

module.exports = upload;