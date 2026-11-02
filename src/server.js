require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve assets folder if needed
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Mount routes under both /api and root / for seamless Vercel serverless routing
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Dhrub Pandit Portfolio API',
    uptime: process.uptime()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Dhrub Pandit Portfolio API',
    uptime: process.uptime()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Dhrub Pandit Portfolio Backend API',
    status: 'online',
    endpoints: {
      profile: '/api/profile',
      chat: '/api/chat',
      contact: '/api/contact',
      stats: '/api/stats',
      health: '/api/health',
      resume: '/api/resume/download'
    }
  });
});

// Start local server when run directly (e.g. node src/server.js)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Dhrub Pandit Portfolio Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
