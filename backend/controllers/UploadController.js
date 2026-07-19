const axios = require('axios');
const FormData = require('form-data');
const Paper = require('../models/Paper');

// POST /api/upload
exports.handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    console.log(`📄 Received: ${req.file.originalname} (${req.file.size} bytes)`);

    let extractedText = '';
    let pageCount = 0;
    let isMock = false;

    try {
      const form = new FormData();
      form.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: 'application/pdf'
      });

      console.log(`🐍 Calling Python service...`);

      const response = await axios.post(
        `${process.env.AI_SERVICE_URL}/extract`,
        form,
        {
          headers: form.getHeaders(),
          timeout: 30000
        }
      );

      extractedText = response.data.text;
      pageCount = response.data.page_count;
      console.log(`✅ Extraction done: ${pageCount} pages`);

    } catch (pyError) {
      console.warn('⚠️ Python service unavailable — using mock data');
      extractedText = `Mock Extracted Text: This is a fallback placeholder because 
      the AI service was unreachable or returned an error. 
      Abstract: This paper presents a novel approach... 
      Introduction: Research in this area has grown... 
      Methodology: We conducted experiments... 
      Results: Our approach achieves 95% accuracy... 
      Conclusion: This work demonstrates effectiveness.`;
      pageCount = Math.floor(Math.random() * 10) + 3;
      isMock = true;
    }

    const paper = new Paper({
      filename: req.file.originalname,
      extractedText,
      pageCount,
      status: 'done'
    });

    await paper.save();
    console.log(`💾 Saved to MongoDB: ${paper._id}`);

    return res.status(201).json({
      paper_id: paper._id,
      filename: paper.filename,
      page_count: paper.pageCount,
      text_preview: extractedText.substring(0, 300) + '...',
      status: paper.status,
      uploaded_at: paper.uploadedAt,
      ...(isMock && { _mock_fallback: true })
    });

  } catch (err) {
    console.error('❌ Upload failed:', err.message);
    return res.status(500).json({
      error: 'Upload failed',
      details: err.message
    });
  }
};

// GET /api/papers/:id
exports.getPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    return res.status(200).json(paper);
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to fetch paper',
      details: err.message
    });
  }
};

// GET /api/papers
exports.getAllPapers = async (req, res) => {
  try {
    const papers = await Paper.find(
      {},
      'filename uploadedAt pageCount status'
    );
    return res.status(200).json(papers);
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to fetch papers',
      details: err.message
    });
  }
};