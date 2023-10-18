const multer = require('multer');
const AVTAR_PATH = '/files'
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, path.join(__dirname, '..', AVTAR_PATH));
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
