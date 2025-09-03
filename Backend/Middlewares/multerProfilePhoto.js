const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileFilter = require('./fileFilterProfilePic');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.user.userId

    if (!userId) {
      return cb(new Error('user_id is required in form-data'), false);
    }

    const baseDir = path.join(__dirname, '../Documents/PWDs');
    const userDir = path.join(baseDir, userId.toString());

    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }

    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    const userId = req.user.userId;

    let filename;
    if (file.fieldname === 'profilePhoto') {
      filename = `ProfilePicture-ID${userId}${path.extname(file.originalname)}`;
    } else if (file.fieldname === 'resume') {
      filename = `Resume-ID${userId}${path.extname(file.originalname)}`;
    } else {
      // fallback just in case
      filename = `${file.fieldname}-ID${userId}${path.extname(file.originalname)}`;
    }

    cb(null, filename);
  }
});

const ProfilePhoto = multer({ storage, fileFilter }).fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]);

module.exports = ProfilePhoto