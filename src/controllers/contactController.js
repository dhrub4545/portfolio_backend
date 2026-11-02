const fs = require('fs');
const path = require('path');

const MESSAGES_FILE = path.join(__dirname, '../../data/messages.json');
const STATS_FILE = path.join(__dirname, '../../data/stats.json');

// Ensure data directory exists
function ensureDataFiles() {
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
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
}

ensureDataFiles();

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

    ensureDataFiles();
    const rawMessages = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    const messages = JSON.parse(rawMessages || '[]');

    const newMessage = {
      id: 'msg_' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    messages.push(newMessage);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));

    // Update stats
    try {
      const rawStats = fs.readFileSync(STATS_FILE, 'utf-8');
      const stats = JSON.parse(rawStats || '{}');
      stats.messagesSent = (stats.messagesSent || 0) + 1;
      stats.lastUpdated = new Date().toISOString();
      fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
    } catch (e) {
      console.warn('Failed to update stats:', e.message);
    }

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
    ensureDataFiles();
    const rawStats = fs.readFileSync(STATS_FILE, 'utf-8');
    const stats = JSON.parse(rawStats || '{}');
    return res.json({
      views: stats.views || 1420,
      messagesSent: stats.messagesSent || 0,
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
    ensureDataFiles();
    const rawStats = fs.readFileSync(STATS_FILE, 'utf-8');
    const stats = JSON.parse(rawStats || '{}');
    stats.views = (stats.views || 1420) + 1;
    stats.lastUpdated = new Date().toISOString();
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
    return res.json({ success: true, views: stats.views });
  } catch (error) {
    return res.json({ success: false });
  }
}

module.exports = { submitContact, getStats, recordPageView };
