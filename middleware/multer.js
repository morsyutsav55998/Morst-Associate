const multer = require('multer');
const AVATAR_PATH = '/files'
const fs = require('fs')
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', AVATAR_PATH)); 
    },
    filename: (req, file, cb) => {
        const originalname = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, originalname + '-' + file.originalname)
    }
});

const upload = multer({
    storage
});

module.exports = upload;
