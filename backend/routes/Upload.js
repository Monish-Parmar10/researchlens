const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  handleUpload,
  getPaper,
  getAllPapers
} = require('../controllers/uploadController');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// POST /api/upload
router.post('/upload', upload.single('file'), handleUpload);

// GET /api/papers
router.get('/papers', getAllPapers);

// GET /api/papers/:id
router.get('/papers/:id', getPaper);

module.exports = router;