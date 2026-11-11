const dhrubProfile = require('../data/dhrubContext');

/**
 * Intelligent AI Assistant for Dhrub Pandit's Portfolio
 * Supports Gemini API integration when GEMINI_API_KEY is present,
 * with a high-fidelity local intent matching fallback.
 */

async function handleChat(req, res) {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const trimmedMsg = message.trim();
    const rawKey = process.env.GEMINI_API_KEY;
    const apiKey = rawKey ? rawKey.trim().replace(/^["']|["']$/g, '') : null;

    // Check if GEMINI_API_KEY is provided
    if (apiKey) {
      try {
        const geminiResult = await queryGemini(trimmedMsg, history, apiKey);
        return res.json({
          reply: typeof geminiResult === 'string' ? geminiResult : geminiResult.reply,
          source: 'gemini',
          model: geminiResult.model || 'gemini-latest'
        });
      } catch (geminiError) {
        console.warn('Gemini API call failed, using intelligent local engine:', geminiError.message);
      }
    }

    // Local Intelligent Reasoning Engine
    const localReply = generateLocalResponse(trimmedMsg);
    return res.json({ reply: localReply, source: 'local' });
  } catch (error) {
    console.error('Error in chat controller:', error);
    return res.status(500).json({
      error: 'An error occurred while processing your request.',
      reply: "I'm having a little trouble connecting right now, but feel free to reach out to Dhrub directly at panditdhrub0@gmail.com!"
    });
  }
}

/**
 * Intelligent Local Intent & Entity Reasoning Engine
 */
function generateLocalResponse(query) {
  const q = query.toLowerCase();

  // 1. Projects - Audex AI
  if (q.includes('audex') || (q.includes('spend') && q.includes('llm')) || (q.includes('benchmark') && q.includes('token'))) {
    return `**AUDEX AI** is one of Dhrub's flagship projects! It is an enterprise LLM spend auditing and optimization platform built with **React 19, Node.js, Express, MongoDB, and Redis**.

Key features include:
• Audits subscription allocations and token volumes across **579+ AI models**.
• Interactive token calculators and real-time subscription vs. API savings comparisons.
• Direct Google and GitHub OAuth 2.0 flows with stateless JWT authentication.
• Credit-based tier restriction system with Redis caching and Razorpay payment integration.

You can check out the live demo at [audexai.in](https://www.audexai.in) or review the code on GitHub at [github.com/dhrub4545/Audex_AI_frontend](https://github.com/dhrub4545/Audex_AI_frontend).`;
  }

  // 2. Projects - Quiz Generator
  if (q.includes('quiz') || q.includes('mcq') || q.includes('question')) {
    return `Dhrub built an **LLM-Powered Automated Quiz Generation Platform** using **React.js, Node.js, Express.js, MongoDB, and the Google Gemini API**!

Highlights:
• Generates dynamic, interactive quizzes from arbitrary topics using LLMs.
• Complete management workflow for creating, taking, and evaluating quizzes.
• Persistent user profiles, scores, and quiz histories modeled in MongoDB.
• Check out the repo at [github.com/dhrub4545/quiz-Generator--main](https://github.com/dhrub4545/quiz-Generator--main).`;
  }

  // 3. Projects - MovieTV / Streaming
  if (q.includes('movie') || q.includes('stream') || q.includes('iptv') || q.includes('hls')) {
    return `**MovieTV** is Dhrub's cinematic video streaming and IPTV platform featuring 100% Android TV and Web parity.
• Built with **React, Node.js, Express, and HLS.js**.
• Includes a custom AES-128 stream decryptor, an IPTV M3U parser for 800+ live channels, and a +12dB Web Audio DSP gain boost.
• Code is available at [github.com/dhrub4545/movieTV-web](https://github.com/dhrub4545/movieTV-web).`;
  }

  // 4. Projects - fshare / P2P
  if (q.includes('fshare') || q.includes('p2p') || q.includes('webrtc') || q.includes('file transfer')) {
    return `**fshare & P2P Tunnel** is a zero-storage browser-to-browser file transfer platform built with **WebRTC (PeerJS), React, and Node.js**.
• Transfers files directly peer-to-peer with 0 MB server storage.
• Uses 64KB chunking, backpressure pacing, and instant QR code / 6-digit PIN matchmaking.
• Repo: [github.com/dhrub4545/fshare](https://github.com/dhrub4545/fshare).`;
  }

  // 5. Projects - General
  if (q.includes('project') || q.includes('portfolio') || q.includes('work') || q.includes('built')) {
    return `Dhrub has engineered several production-grade full-stack and AI platforms:

1. **AUDEX AI** — Enterprise LLM Spend Auditing & Optimization Platform ([audexai.in](https://www.audexai.in))
2. **MovieTV** — Cinematic video streaming & 800+ Live IPTV channels ([movieTV-web](https://github.com/dhrub4545/movieTV-web))
3. **fshare** — Zero-storage WebRTC peer-to-peer file transfer ([fshare](https://github.com/dhrub4545/fshare))
4. **LLM Quiz Generator** — AI-driven automated quiz platform ([quiz-Generator](https://github.com/dhrub4545/quiz-Generator--main))
5. **YPSS** — Enterprise School ERP & Bilingual AI Question Engine ([YPSS](https://github.com/dhrub4545/YPSS))
6. **AI & Real-Time Chat App** — Instant messaging with AI conversational interface ([chat-app](https://github.com/dhrub4545/Web-Based-Real-Time-AI-Chat-Application))

You can filter and explore all of them in the **Projects** section on this page!`;
  }

  // 6. Skills & Tech Stack
  if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('language') || q.includes('framework')) {
    return `Dhrub is a **Full Stack & AI Engineer** with extensive experience across the modern software stack:

• **Frontend:** React.js (v19), TypeScript, Vite, Tailwind CSS, Lenis Smooth Scroll, Floating UI, Bootstrap
• **Backend:** Node.js, Express.js, REST APIs, Socket.IO, WebRTC (PeerJS), Django, JWT, OAuth 2.0
• **Databases & Cache:** MongoDB Atlas, Redis (ioredis), MySQL, Schema Indexing & Design
• **AI & LLMs:** Google Gemini API, xAI / Grok 4.5, OpenAI, Groq, OpenRouter, Prompt Engineering, Applied ML
• **DevOps & Tools:** Docker, Git/GitHub, Vercel, Render, Postman, Node-Cron, 200+ LeetCode DSA problems solved`;
  }

  // 7. Education & Degree & CGPA
  if (q.includes('education') || q.includes('college') || q.includes('university') || q.includes('degree') || q.includes('cgpa') || q.includes('gpa') || q.includes('vtu') || q.includes('rrit')) {
    return `Dhrub studied at **R. R. Institute of Technology, Bengaluru, India (VTU)**:
• **Degree:** Bachelor of Engineering (B.E.) in Computer Science and Engineering
• **Period:** September 2022 – May 2026
• **CGPA:** **8.94 / 10** (First Class with Distinction)
• **Licensing:** Licensed Computer Science Engineer by the **Nepal Engineering Council (NEC)**.
• Solved **200+ LeetCode** problems in Data Structures and Algorithms.`;
  }

  // 8. Experience & Internship
  if (q.includes('experience') || q.includes('intern') || q.includes('karunadu') || q.includes('work experience') || q.includes('job')) {
    return `Dhrub completed an internship at **Karunadu Technologies Private Limited** (Feb 2026 – May 2026) in Bengaluru as a **Python Programming & Applied Machine Learning Intern**:
• Engineered a **Lung Cancer Prediction platform** using supervised classification integrated into a Django backend.
• Developed a **Dry Bean Classification model** with feature scaling, extraction, and multiclass algorithm benchmarking.
• Verified with an official certificate which you can view right in the **Experience** section of this portfolio!`;
  }

  // Certifications & Verified Credentials
  if (q.includes('certificat') || q.includes('credential') || q.includes('license') || q.includes('nec') || q.includes('iit') || q.includes('nptel') || q.includes('codeathon') || q.includes('hackathon') || q.includes('award')) {
    return `Dhrub holds **10 verified credentials and honors**, strategically ranked with top job assets first:

1. 🏛️ **Nepal Engineering Council (NEC) Statutory License** (Reg No: 102299) — Official Government Licensure as a Professional Computer Engineer under the NEC Act 1999.
2. 🏆 **IIT Madras & NPTEL Elite Certification** (Roll: NPTEL23CS95S14643889) — Elite 64% with 25/25 assignment record in *Programming, Data Structures & Algorithms Using Python*.
3. 💼 **Karunadu Technologies ML Internship** (KTPT/INT/2026/1338) — Production machine learning engineering and Django inference integration.
4. ☁️ **Google Cloud Gen AI Exchange Hackathon 2025** (2025H2S08GH-P1000338) — Prototype submission for *Personalized Career & Skills Advisor*.
5. 🏦 **RBI Innovation Hub, IIIT Bangalore & Canara Bank 24h Codeathon** — High-intensity AI & Data Science hackathon with Team Veda.
6. 📄 **International Conference Research Paper (ICDIES-2026)** (P-ISBN: 978-93-7837-204-9) — *"QUIZZY- Automated Question Generator Using LLM"*.

You can inspect the high-resolution certificate scans and download official verification PDFs directly in the interactive **Certifications** section!`;
  }

  // 9. Contact / Email / Phone / Socials
  if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('phone') || q.includes('reach') || q.includes('message')) {
    return `You can get in touch with Dhrub directly:
• **Email:** [panditdhrub0@gmail.com](mailto:panditdhrub0@gmail.com)
• **Phone:** +9779803862836
• **GitHub:** [github.com/dhrub4545](https://github.com/dhrub4545)
• **LinkedIn:** [linkedin.com/in/dhrub-pandit](https://www.linkedin.com)
• **LeetCode:** [leetcode.com/u/Dhrub417183/](https://leetcode.com/u/Dhrub417183/)

You can also send a direct message using the interactive **Contact Form** at the bottom of the page!`;
  }

  // 10. Resume
  if (q.includes('resume') || q.includes('cv') || q.includes('download')) {
    return `You can view Dhrub's complete resume anytime by clicking the **"Resume"** button in the top navigation bar or the Hero section. It opens an interactive modal preview where you can read and download the PDF (**Dhrub_ResumeNP.pdf**)!`;
  }

  // 11. Location / Origin
  if (q.includes('where') || q.includes('location') || q.includes('based') || q.includes('nepal') || q.includes('bengaluru') || q.includes('bangalore')) {
    return `Dhrub is based in **Nepal / Bengaluru, India** (where he completed his B.E. in Computer Science at RRIT). He is an officially licensed engineer by the **Nepal Engineering Council (NEC)**.`;
  }

  // 12. Default Greeting / General
  if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('who are you') || q.includes('about')) {
    return `Hey there! 👋 I'm **Dhrub Pandit's AI Assistant**. 

I know all about Dhrub's engineering background, projects like **AUDEX AI** and **MovieTV**, his tech stack (**React 19, Node.js, Express, MongoDB, Redis, AI**), his academic record at **RRIT Bengaluru (8.94 CGPA)**, and his internship at **Karunadu Technologies**.

Feel free to ask me anything, such as:
• *"What are Dhrub's top technical skills?"*
• *"Tell me about the AUDEX AI platform"*
• *"What is his education and CGPA?"*
• *"How can I get in touch with Dhrub?"*`;
  }

  // Catch-all
  return `That's a great question! Dhrub is a **Full Stack & AI Engineer** with deep expertise in React.js, Node.js, Express, MongoDB, and AI API integrations. He holds an **8.94 CGPA** from RRIT Bengaluru, has solved **200+ LeetCode** problems, and has created SaaS systems like **AUDEX AI** ([audexai.in](https://www.audexai.in)).

Would you like to know more about his **projects**, **skills**, **experience**, or **how to contact him**?`;
}

let cachedModels = null;
let lastCacheTime = 0;
let lastWinningModel = 'gemini-flash-lite-latest';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1-hour cache

/**
 * Semantic scoring function that dynamically ranks Gemini models.
 * Prioritizes gemini-flash-lite-latest and gemini-flash-latest, followed by newest generation versions.
 */
function scoreModel(name) {
  let score = 0;
  if (name === 'gemini-flash-lite-latest') score += 500;
  if (name === 'gemini-flash-latest') score += 490;

  const match = name.match(/gemini-(\d+(?:\.\d+)?)/i);
  if (match) {
    score += parseFloat(match[1]) * 100;
  }
  // Reward low-latency conversational models suitable for web chat
  if (name.includes('flash') && !name.includes('lite')) score += 30;
  if (name.includes('flash-lite') || name.includes('lite')) score += 15;
  if (name.includes('latest')) score += 10;
  return score;
}

const FAST_DEFAULT_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash'
];

/**
 * Returns prioritized candidate models:
 * Prioritizes fast, verified models (like gemini-flash-lite-latest) to ensure sub-2-second latency
 * and avoid serverless execution timeouts.
 */
function getAdaptiveModelList() {
  const customModel = process.env.GEMINI_MODEL ? process.env.GEMINI_MODEL.trim() : null;
  const pool = cachedModels && cachedModels.length > 0 ? cachedModels : FAST_DEFAULT_MODELS;
  return [...new Set([customModel, lastWinningModel, ...pool].filter(Boolean))];
}

/**
 * Gemini API Call querying Google's latest models with automated adaptation and fallback
 */
async function queryGemini(prompt, history, apiKey) {
  const candidateModels = await getAdaptiveModelList(apiKey);

  const systemInstruction = `You are the official AI Assistant for Dhrub Pandit's personal portfolio website. 

VERIFIED FACTS ABOUT DHRUB:
- Name: Dhrub Pandit
- Title: Full Stack & AI Engineer
- Primary Locations: Nepal / Bengaluru, India (Available for remote worldwide & on-site positions)
- Education: R. R. Institute of Technology, Bengaluru (VTU), B.E. in Computer Science and Engineering, CGPA: 8.94/10 (First Class with Distinction).
- Statutory Licensure: Nepal Engineering Council (NEC) Licensed Professional Computer Engineer (Reg No: 102299).
- Key Certifications & Distinctions:
  1. Nepal Engineering Council License (Reg No: 102299)
  2. IIT Madras & NPTEL Elite Certification - Programming, DSA Using Python (Roll: NPTEL23CS95S14643889, 25/25 assignments, 64% Elite)
  3. Karunadu Technologies ML Internship Certificate (KTPT/INT/2026/1338)
  4. Google Cloud Gen AI Exchange Hackathon 2025 Prototype (2025H2S08GH-P1000338)
  5. RBI Innovation Hub, IIIT Bangalore & Canara Bank 24h AI Codeathon (Team Veda)
  6. 7th Int'l Conference (ICDIES-2026) Published Research Paper (P-ISBN: 978-93-7837-204-9) - "QUIZZY- Automated Question Generator Using LLM"
- Experience: Karunadu Technologies Private Limited (Python Programming & Applied ML Intern, Feb 2026 - May 2026).
- Core Projects: 
  1. AUDEX AI ([audexai.in](https://www.audexai.in)) - Enterprise LLM spend auditing across 579+ models, Razorpay, Redis, JWT.
  2. MovieTV ([GitHub](https://github.com/dhrub4545/movieTV-web)) - Cinematic streaming & 800+ IPTV channels with AES-128 decryptor.
  3. fshare ([GitHub](https://github.com/dhrub4545/fshare)) - Zero-storage WebRTC P2P chunked file transfer.
  4. LLM Quiz Generator ([GitHub](https://github.com/dhrub4545/quiz-Generator--main)) - Automated quiz platform with Google Gemini.
  5. YPSS ([GitHub](https://github.com/dhrub4545/YPSS)) - Enterprise School ERP with AI question engine.
- Skills: React 19, Node.js, Express, MongoDB, Redis, JWT, OAuth 2.0, WebRTC, Gemini API, Docker, Python, C++, 200+ LeetCode problems solved.
- Contact: Email: [panditdhrub0@gmail.com](mailto:panditdhrub0@gmail.com) | Phone: +9779803862836 | [GitHub](https://github.com/dhrub4545) | [LeetCode](https://leetcode.com/u/Dhrub417183/) | [LinkedIn](https://www.linkedin.com/in/dhrub-pandit-2a4b37248/).

STRICT RESPONSE FORMATTING GUIDELINES:
1. Always format responses in clean, structured Markdown.
2. Use **bold** for key technologies, project titles, metrics, and highlights.
3. Use bullet points (• or -) for feature lists, skills, or achievements for instant scannability.
4. When mentioning links, repositories, or websites, ALWAYS format them as markdown links, e.g. [AUDEX AI](https://www.audexai.in) or [GitHub Profile](https://github.com/dhrub4545).
5. Keep your response concise (typically 2 to 4 short paragraphs or bullet groups). Avoid fluff, generic pleasantries, or repeating the user's question. Get straight to the answer.`;

  // Provide compact recent conversation context if present
  const formattedHistory = (history || [])
    .slice(-4)
    .filter(h => h.text && h.text.trim())
    .map(h => `${h.role === 'user' ? 'Visitor' : 'Assistant'}: ${h.text}`)
    .join('\n');

  const fullPromptText = `${systemInstruction}

${formattedHistory ? `Recent Conversation Context:\n${formattedHistory}\n\n` : ''}Visitor Question: ${prompt}

Assistant:`;

  let lastError = null;

  for (const model of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPromptText }]
            }
          ]
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Gemini model ${model} failed (status ${response.status}):`, errorText);
        lastError = new Error(`Gemini HTTP error ${response.status}: ${errorText}`);
        continue; // Try next model in adaptive candidate list
      }

      const data = await response.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (replyText) {
        lastWinningModel = model; // Automatically pin and remember current active model
        return { reply: replyText, model };
      }
    } catch (err) {
      lastError = err;
      console.warn(`Error querying Gemini model ${model}:`, err.message);
    }
  }

  throw lastError || new Error('All Gemini candidate models failed.');
}

function getAdaptiveModelStatus() {
  return {
    lastWinningModel,
    discoveredCount: cachedModels ? cachedModels.length : 0,
    topDiscoveredModels: cachedModels ? cachedModels.slice(0, 5) : ['gemini-3.5-flash', 'gemini-3.5-flash-lite'],
    lastCacheUpdate: lastCacheTime ? new Date(lastCacheTime).toISOString() : null
  };
}

module.exports = { handleChat, getAdaptiveModelStatus };
