const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const dhrubProfile = require('../data/dhrubContext');
const { handleChat } = require('../controllers/chatController');
const { submitContact, getStats, recordPageView } = require('../controllers/contactController');

// 1. Profile information
router.get('/profile', (req, res) => {
  res.json(dhrubProfile);
});

// 2. AI Chatbot & Status Diagnostics
router.post('/chat', handleChat);
router.get('/chat/status', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  const keyLength = hasKey ? process.env.GEMINI_API_KEY.trim().length : 0;
  res.json({
    status: 'ok',
    geminiKeyConfigured: hasKey,
    geminiKeyLength: keyLength,
    candidateModels: [process.env.GEMINI_MODEL, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'].filter(Boolean),
    timestamp: new Date().toISOString()
  });
});

// 3. Contact Form Submission
router.post('/contact', submitContact);

// 4. Analytics & Stats
router.get('/stats', getStats);
router.post('/stats/view', recordPageView);

// 5. Download Resume
router.get('/resume/download', (req, res) => {
  const resumePath = path.join(__dirname, '../../assets/Dhrub_ResumeNP.pdf');
  if (fs.existsSync(resumePath)) {
    res.download(resumePath, 'Dhrub_Pandit_Resume.pdf');
  } else {
    res.status(404).json({ error: 'Resume file not found on server.' });
  }
});

module.exports = router;
