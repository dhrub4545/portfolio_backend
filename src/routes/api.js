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
    activeModel: 'gemini-3.5-flash',
    candidateModels: [process.env.GEMINI_MODEL, 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'].filter(Boolean),
    timestamp: new Date().toISOString()
  });
});

router.get('/chat/test', async (req, res) => {
  const rawKey = process.env.GEMINI_API_KEY;
  const apiKey = rawKey ? rawKey.trim().replace(/^["']|["']$/g, '') : null;
  if (!apiKey) {
    return res.json({ error: 'No GEMINI_API_KEY found in process.env' });
  }

  const modelToTest = req.query.model || 'gemini-3.5-flash';

  try {
    const genRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToTest}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Say: Hello from Dhrub Pandit portfolio!' }] }] })
    });
    const genData = await genRes.json();
    const text = genData.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.json({
      googleConnected: true,
      testedModel: modelToTest,
      status: genRes.status,
      success: !!text,
      reply: text || null,
      rawError: text ? null : genData
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
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
