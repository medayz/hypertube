const multer = require('multer');
const uuid = require('uuid/v1');
const fs = require('fs');
const createError = require('http-errors');

fs.mkdirSync('images', { recursive: true });

function destination(req, file, cb) {
  cb(null, process.env.IMAGES_PATH);
}

function filename(req, file, cb) {
  try {
    const extention = file.mimetype.split('/').pop();

    const filename = `${uuid()}.${extention}`;
    cb(null, filename);
  } catch (err) {
    cb(createError(500));
  }
}

function fileFilter(req, file, cb) {
  const supportedFormat = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

  if (supportedFormat.includes(file.mimetype)) return cb(null, true);

  cb(null, false);
}

const storage = multer.diskStorage({
  destination,
  filename
});

const limits = {
  fileSize: parseInt(process.env.MAX_IMAGE_SIZE)
};

module.exports.upload = multer({ storage, fileFilter, limits }).single(
  'avatar'
);

module.exports.multerError = (error, req, res, next) => {
  if (!(error instanceof multer.MulterError)) return next(error);

  next(createError(400, 'Invalid image'));
};
