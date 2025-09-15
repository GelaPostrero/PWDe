const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileFilter = require('./fileFilterProfilePic');

const deleteOldFiles = (userDir, baseFilename, currentExtension) => {
  try {
    const possibleExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    possibleExtensions.forEach(ext => {
      if (ext !== currentExtension) {
        const oldFilePath = path.join(userDir, `${baseFilename}${ext}`);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log(`Deleted old file: ${oldFilePath}`);
        }
      }
    });
  } catch (error) {
    console.error('Error deleting old files:', error);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.user?.userId
    const userType = req.user?.userType

    if (!userId || !userType) {
      return cb(new Error('userId and userType is required in form-data'), false);
    }

    const baseDir = path.join(__dirname, `../Documents/${userType === 'PWD' ? 'PWDs' : 'Employer'}`);
    const userDir = path.join(baseDir, userId.toString());

    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }

    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    const userId = req.user.userId;
    const userDir = req.userDir;
    const fileExtension = path.extname(file.originalname);

    let filename;
    let baseFilename;
    
    if (file.fieldname === 'profilePhoto') {
      baseFilename = `ProfilePicture-ID${userId}`;
      filename = `${baseFilename}${fileExtension}`;
      deleteOldFiles(userDir, baseFilename, fileExtension);
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