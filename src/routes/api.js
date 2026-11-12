const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const dhrubProfile = require('../data/dhrubContext');
const { handleChat, getAdaptiveModelStatus } = require('../controllers/chatController');
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
  const adaptive = getAdaptiveModelStatus();

  res.json({
    status: 'ok',
    geminiKeyConfigured: hasKey,
    geminiKeyLength: keyLength,
    adaptiveDiscovery: true,
    activeModel: adaptive.lastWinningModel || 'gemini-flash-lite-latest',
    discoveredCount: adaptive.discoveredCount,
    topRankedModels: adaptive.topDiscoveredModels,
    lastCacheUpdate: adaptive.lastCacheUpdate,
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

// 3. Contact Form Submission & WhatsApp Diagnostic
router.post('/contact', submitContact);
router.get('/contact/whatsapp-test', async (req, res) => {
  const token = (
    process.env.META_WHATSAPP_TOKEN ||
    process.env.WHATSAPP_ACCESS_TOKEN ||
    process.env.WHATSAPP_TOKEN ||
    process.env.META_ACCESS_TOKEN ||
    ''
  ).trim();

  const phoneId = (
    process.env.META_PHONE_NUMBER_ID ||
    process.env.WHATSAPP_PHONE_NUMBER_ID ||
    '1487993791054252'
  ).trim();

  const recipientPhone = (process.env.WHATSAPP_PHONE || '9779803862836').replace(/[^\d]/g, '');

  if (!token) {
    return res.json({
      configured: false,
      error: 'No WhatsApp token found in process.env.',
      checkedKeys: ['META_WHATSAPP_TOKEN', 'WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_TOKEN', 'META_ACCESS_TOKEN'],
      hint: 'In Vercel, after saving environment variables, please Redeploy the latest deployment for changes to take effect.'
    });
  }

  try {
    const endpoint = `https://graph.facebook.com/v21.0/${phoneId}/messages`;
    const metaRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: recipientPhone,
        type: 'text',
        text: {
          body: `🔔 *Dhrub Pandit Portfolio Alert*\nLive diagnostic test from Vercel! Your WhatsApp connection is 100% active. 🚀`
        }
      })
    });

    const metaData = await metaRes.json();
    return res.json({
      configured: true,
      metaHttpCode: metaRes.status,
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 12) + '...',
      phoneId,
      recipientPhone,
      metaResponse: metaData
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

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
