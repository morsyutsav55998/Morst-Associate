const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, path.join(__dirname, '../files'));
    },
    filename: (req, file, cb) => {

        const originalname = Date.now() + '-' + Math.round(Math.random() * 1E9)

        cb(null, file.originalname + '-' + originalname)

    }
});
const upload = multer({
    storage
});
module.exports = upload;
