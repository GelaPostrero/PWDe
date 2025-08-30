const multer = require('multer');
const fileFilter = require('./fileFilter');

const memoryUploadForPWD = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
}).array('documents', 3); // Accept up to 5 files with field name 'documents'

module.exports = memoryUploadForPWD;