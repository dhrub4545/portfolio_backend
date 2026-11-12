const fs = require('fs');
const path = require('path');

// Determine data directory (Vercel serverless functions have a read-only filesystem except /tmp)
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isServerless ? path.join('/tmp', 'portfolio_data') : path.join(__dirname, '../../data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

// In-memory fallback in case filesystem is not available
let inMemoryMessages = [];
let inMemoryStats = {
  views: 1420,
  messagesSent: 0,
  lastUpdated: new Date().toISOString()
};

function ensureDataFiles() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(MESSAGES_FILE)) {
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
    }

    if (!fs.existsSync(STATS_FILE)) {
      fs.writeFileSync(
        STATS_FILE,
        JSON.stringify(
          {
            views: 1420,
            messagesSent: 0,
            lastUpdated: new Date().toISOString()
          },
          null,
          2
        )
      );
    }
  } catch (err) {
    console.warn('Filesystem access limited, operating with in-memory store:', err.message);
  }
}

ensureDataFiles();

async function sendWhatsAppNotification(name, email, subject, message) {
  // 1. Official Meta WhatsApp Cloud API configuration
  const metaToken = (
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

  const textBody = `🔔 *New Portfolio Inquiry!*
👤 *From:* ${name}
📧 *Email:* ${email}
📌 *Subject:* ${subject || 'General Inquiry'}

💬 *Message:*
${message}

⏰ *Received:* ${new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kathmandu' })} (Nepal Time)`;

  // Try Official Meta WhatsApp Cloud API
  if (metaToken && phoneId) {
    try {
      const endpoint = `https://graph.facebook.com/v21.0/${phoneId}/messages`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${metaToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipientPhone,
          type: 'text',
          text: {
            body: textBody
          }
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      const data = await res.json();
      if (res.ok) {
        console.log(`[Contact] Official Meta WhatsApp alert delivered to ${recipientPhone} (ID: ${data.messages?.[0]?.id})`);
        return true;
      } else {
        console.warn(`[Contact] Meta WhatsApp API response (${res.status}):`, JSON.stringify(data));
      }
    } catch (err) {
      console.warn('[Contact] Meta WhatsApp API request failed:', err.message);
    }
  }

  // 2. Fallback to CallMeBot if configured
  const callMeBotKey = process.env.CALLMEBOT_API_KEY;
  if (callMeBotKey) {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(recipientPhone)}&text=${encodeURIComponent(textBody)}&apikey=${callMeBotKey.trim()}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        console.log(`[Contact] CallMeBot alert dispatched to ${recipientPhone}`);
        return true;
      }
    } catch (err) {
      console.warn('[Contact] CallMeBot notification failed:', err.message);
    }
  }

  return false;
}

function submitContact(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and message.'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      });
    }

    const newMessage = {
      id: 'msg_' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    inMemoryMessages.push(newMessage);

    try {
      ensureDataFiles();
      if (fs.existsSync(MESSAGES_FILE)) {
        const rawMessages = fs.readFileSync(MESSAGES_FILE, 'utf-8');
        const messages = JSON.parse(rawMessages || '[]');
        messages.push(newMessage);
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
      }
    } catch (e) {
      console.warn('Could not persist message to disk (retained in-memory):', e.message);
    }

    // Update stats
    inMemoryStats.messagesSent += 1;
    inMemoryStats.lastUpdated = new Date().toISOString();

    try {
      ensureDataFiles();
      if (fs.existsSync(STATS_FILE)) {
        const rawStats = fs.readFileSync(STATS_FILE, 'utf-8');
        const stats = JSON.parse(rawStats || '{}');
        stats.messagesSent = (stats.messagesSent || 0) + 1;
        stats.lastUpdated = new Date().toISOString();
        fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
      }
    } catch (e) {
      // Ignored in serverless
    }

    // Forward notification to WhatsApp if CallMeBot is configured
    sendWhatsAppNotification(newMessage.name, newMessage.email, newMessage.subject, newMessage.message).catch(
      (err) => console.warn('[Contact] Async WhatsApp delivery error:', err.message)
    );

    return res.status(201).json({
      success: true,
      message: `Thank you, ${name}! Your message has been received. Dhrub will get back to you shortly at ${email}.`,
      messageId: newMessage.id
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while sending your message.'
    });
  }
}

function getStats(req, res) {
  try {
    let currentViews = inMemoryStats.views;
    try {
      ensureDataFiles();
      if (fs.existsSync(STATS_FILE)) {
        const rawStats = fs.readFileSync(STATS_FILE, 'utf-8');
        const stats = JSON.parse(rawStats || '{}');
        if (stats.views) currentViews = stats.views;
      }
    } catch (e) {}

    return res.json({
      views: currentViews || 1420,
      messagesSent: inMemoryStats.messagesSent || 0,
      status: 'Available for full-time & AI contracts',
      liveProjects: 6,
      modelsBenchmarked: 579,
      githubRepos: 18,
      cgpa: '8.94'
    });
  } catch (error) {
    return res.json({
      views: 1420,
      status: 'Available',
      githubRepos: 18,
      cgpa: '8.94'
    });
  }
}

function recordPageView(req, res) {
  try {
    inMemoryStats.views += 1;
    inMemoryStats.lastUpdated = new Date().toISOString();

    try {
      ensureDataFiles();
      if (fs.existsSync(STATS_FILE)) {
        const rawStats = fs.readFileSync(STATS_FILE, 'utf-8');
        const stats = JSON.parse(rawStats || '{}');
        stats.views = (stats.views || 1420) + 1;
        stats.lastUpdated = new Date().toISOString();
        fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
        return res.json({ success: true, views: stats.views });
      }
    } catch (e) {}

    return res.json({ success: true, views: inMemoryStats.views });
  } catch (error) {
    return res.json({ success: false });
  }
}

module.exports = { submitContact, getStats, recordPageView };
