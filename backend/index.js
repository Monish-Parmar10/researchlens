const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const uploadRoute = require('./routes/upload');

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────
app.use('/api', uploadRoute);

// ── Health check (good for testing if server is alive) ─────────────────
app.get('/', (req, res) => {
  res.json({ message: '🔬 ResearchLens Backend is running!' });
});

// ── Connect MongoDB → Start Server ────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
      console.log(`📬 Upload endpoint: POST http://localhost:${process.env.PORT || 5000}/api/upload`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
