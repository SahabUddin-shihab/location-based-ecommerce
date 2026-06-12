const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = req.uploadFolder || 'uploads';
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, name);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(ApiError.badRequest('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
});


const uploadSingle = (fieldName) => upload.single(fieldName);
const uploadMultiple = (fieldName, maxCount = 10) => upload.array(fieldName, maxCount);


const setUploadFolder = (folder) => (req, res, next) => {
    req.uploadFolder = `uploads/${folder}`;
    next();
};

module.exports = { upload, uploadSingle, uploadMultiple, setUploadFolder };
