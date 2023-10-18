const multer = require('multer');
const AVATAR_PATH = '/files'
const fs = require('fs')
const path = require('path');
const getUniqueFolderName = () => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    return `${timestamp}-${random}`;
  };
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', AVATAR_PATH)); 
        // const folderName = getUniqueFolderName();
        // const uploadPath = path.join(__dirname, '..', AVATAR_PATH, folderName);
        // fs.mkdirSync(uploadPath, { recursive: true }); // Create the folder if it doesn't exist
        // cb(null, uploadPath);
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
