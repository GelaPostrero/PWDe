function fileFilter(req, file, cb) {
  if (file.fieldname === 'profile_picture') {
    // Only jpg/png
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      return cb(new Error('Only JPG and PNG images are allowed for profile picture'), false);
    }
  }

  if (file.fieldname === 'resume_cv_file') {
    // Only pdf/doc/docx
    if (!file.originalname.match(/\.(pdf|doc|docx)$/i)) {
      return cb(new Error('Only PDF, DOC, DOCX files are allowed for resume'), false);
    }
  }

  cb(null, true);
}

module.exports = fileFilterForProfilePic = fileFilter;