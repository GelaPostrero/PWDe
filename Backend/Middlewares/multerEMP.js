const multer = require('multer');
const fileFilter = require('./fileFilter');

const memoryUploadForEMP = multer({ 
  storage: multer.memoryStorage(), 
  fileFilter 
}).fields([
  { name: 'businessRegistration', maxCount: 1 },
  { name: 'governmentId', maxCount: 1 },
  { name: 'taxDocuments', maxCount: 1 }
]);

module.exports = memoryUploadForEMP;