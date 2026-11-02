# Dhrub Pandit — Portfolio Backend API 🚀

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.21-blue.svg?style=for-the-badge&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg?style=for-the-badge)](LICENSE)

> Production-ready Node.js & Express REST API powering Dhrub Pandit's interactive developer portfolio website. Features an intelligent AI Chat Assistant, contact form submission, live visitor telemetry, and resume download service.

---

## 🛠️ Features

* **Intelligent AI Assistant API (`POST /api/chat`)**: Conversational NLP reasoning engine primed with Dhrub Pandit's verified engineering facts, education (VTU 8.94 CGPA), AUDEX AI platform, projects, and contact channels. Seamlessly supports Google Gemini API integration when `GEMINI_API_KEY` is provided.
* **Contact Ingestion & Validation (`POST /api/contact`)**: Form validation, persistence, and automated confirmation response.
* **Visitor Analytics & Telemetry (`GET /api/stats` & `POST /api/stats/view`)**: Live impression tracking.
* **Official Resume Distribution (`GET /api/resume/download`)**: Direct binary stream download of `Dhrub_ResumeNP.pdf`.
* **Health Check & Monitoring (`GET /api/health`)**: Server uptime and operational status.

---

## 📁 Project Structure

```
portfolio_backend/
├── assets/
│   └── Dhrub_ResumeNP.pdf           # Downloadable PDF resume
├── src/
│   ├── controllers/
│   │   ├── chatController.js        # AI chat reasoning engine + Gemini API
│   │   └── contactController.js     # Contact validation & stats management
│   ├── data/
│   │   └── dhrubContext.js          # Knowledge base for Dhrub Pandit
│   ├── routes/
│   │   └── api.js                   # Express route definitions
│   └── server.js                    # Server bootstrap, CORS, JSON middleware
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
* **Node.js** v18+ (tested on v22)
* **npm** v9+

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
Contents of `.env`:
```env
PORT=5000

# Optional: Add Google Gemini API key for dynamic LLM generation
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Server
```bash
# Production mode:
npm start

# Development mode (with nodemon):
npm run dev
```

Server runs on: **`http://localhost:5000`**

---

## 📡 API Reference

### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-11-02T07:06:01.761Z",
  "service": "Dhrub Pandit Portfolio API",
  "uptime": 24.5
}
```

### Full Profile
```http
GET /api/profile
```
Returns structured JSON containing personal summary, education, experience, projects, and categorized technical skills.

### AI Assistant Chat
```http
POST /api/chat
Content-Type: application/json

{
  "message": "Tell me about AUDEX AI and Dhrub's core skills",
  "history": []
}
```

### Contact Submission
```http
POST /api/contact
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "subject": "Interview Opportunity",
  "message": "Hi Dhrub, we would love to connect regarding an AI engineering role!"
}
```

### Resume Download
```http
GET /api/resume/download
```
Downloads `Dhrub_Pandit_Resume.pdf`.

---

## 👨‍💻 Author
**Dhrub Pandit**
* Full Stack & AI Engineer
* Email: [panditdhrub0@gmail.com](mailto:panditdhrub0@gmail.com)
* GitHub: [@dhrub4545](https://github.com/dhrub4545)
