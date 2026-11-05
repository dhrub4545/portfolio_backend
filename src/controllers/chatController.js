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

    // Check if GEMINI_API_KEY is provided
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiReply = await queryGemini(trimmedMsg, history);
        return res.json({ reply: geminiReply, source: 'gemini' });
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
    return `Dhrub is currently based in **Bengaluru, India** (where he completed his B.E. in Computer Science at RRIT) and is originally from **Nepal**. He is an officially licensed engineer by the **Nepal Engineering Council (NEC)**.`;
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

/**
 * Optional Gemini API Call if GEMINI_API_KEY is configured
 */
async function queryGemini(prompt, history) {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const systemInstruction = `You are the official AI Assistant for Dhrub Pandit's personal portfolio. 
Here are the verified facts about Dhrub:
- Name: Dhrub Pandit
- Title: Full Stack & AI Engineer
- Education: R. R. Institute of Technology, Bengaluru (VTU), B.E. Computer Science, CGPA: 8.94/10 (Sep 2022 - May 2026).
- Licensing: Nepal Engineering Council (NEC) Licensed Computer Science Engineer.
- Experience: Karunadu Technologies Private Limited (Python Programming & Applied ML Intern, Feb 2026 - May 2026).
- Top Projects: 
  1. AUDEX AI (https://www.audexai.in) - Enterprise LLM spend auditing across 579+ models.
  2. MovieTV - Cinematic streaming & 800+ IPTV channels.
  3. fshare - Zero-storage WebRTC P2P file sharing.
  4. LLM Quiz Generator - AI quiz platform.
  5. YPSS - School ERP with AI question engine.
- Skills: React 19, Node.js, Express, MongoDB, Redis, JWT, OAuth 2.0, WebRTC, Gemini API, Docker, Python, C++, 200+ LeetCode problems.
- Contact: panditdhrub0@gmail.com, +9779803862836, GitHub: https://github.com/dhrub4545.
Answer politely, professionally, and concisely in markdown. Always represent Dhrub with enthusiasm and high technical accuracy.`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nVisitor Question: ${prompt}` }]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || generateLocalResponse(prompt);
}

module.exports = { handleChat };
