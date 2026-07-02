const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  extractedText: {
    type: String,
    default: ''
  },
  pageCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'done', 'error'],
    default: 'uploaded'
  }
});

module.exports = mongoose.model('Paper', PaperSchema);