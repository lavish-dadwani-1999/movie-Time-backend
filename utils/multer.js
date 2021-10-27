const multer = require('multer');
const injectDate = require('./injectdate');    

// memory storage is used for uploading the file in server as "cloudinery" 
var multerConfig1 = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024*5 },
  fileFilter: function (req, file, cb) {
    if ( file.mimetype === 'image/jpg' ||file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp') {  // filtering which type of file should be accepted
      cb(null, true);
    } else {
      var newError = new Error('file type is Incorrect');
      newError.name = 'MulterError';
      cb(newError, false);
    }
  },
});
var upload = multer(multerConfig1)
module.exports = upload
