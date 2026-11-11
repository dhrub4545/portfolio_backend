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
    candidateModels: [process.env.GEMINI_MODEL, 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.5-flash', 'gemini-4-argon'].filter(Boolean),
    timestamp: new Date().toISOString()
  });
});

router.get('/chat/test', async (req, res) => {
  const rawKey = process.env.GEMINI_API_KEY;
  const apiKey = rawKey ? rawKey.trim().replace(/^["']|["']$/g, '') : null;
  if (!apiKey) {
    return res.json({ error: 'No GEMINI_API_KEY found in process.env' });
  }

  try {
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const listData = await listRes.json();
    if (!listRes.ok) {
      return res.json({ listStatus: listRes.status, googleError: listData });
    }

    const allModels = (listData.models || []).map(m => m.name.replace('models/', ''));
    const contentModels = (listData.models || [])
      .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
      .map(m => m.name.replace('models/', ''));

    // Try candidate models in order until one succeeds
    const candidates = [process.env.GEMINI_MODEL, 'gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-flash-lite-latest', 'gemini-pro-latest'].filter(Boolean);
    let successfulModel = null;
    let successfulResult = null;
    let modelAttempts = [];

    for (const model of candidates) {
      try {
        const genRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'Respond in one short sentence: Gemini API is online!' }] }] })
        });
        const genData = await genRes.json();
        const text = genData.candidates?.[0]?.content?.parts?.[0]?.text;
        modelAttempts.push({ model, status: genRes.status, success: !!text, response: text || genData.error?.message });
        if (text) {
          successfulModel = model;
          successfulResult = text;
          break;
        }
      } catch (err) {
        modelAttempts.push({ model, error: err.message });
      }
    }

    return res.json({
      googleConnected: true,
      successfulModel,
      reply: successfulResult,
      attempts: modelAttempts
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
