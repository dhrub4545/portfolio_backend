/**
 * Dhrub Pandit - Profile & AI Knowledge Context
 * Extracted directly from official resume and engineering portfolios
 */

const dhrubProfile = {
  personal: {
    name: "Dhrub Pandit",
    title: "Full Stack & AI Engineer",
    headline: "Nepal Engineering Council (NEC) Licensed Computer Science Engineer",
    email: "panditdhrub0@gmail.com",
    phone: "+9779803862836",
    location: "Bengaluru, India / Nepal",
    github: "https://github.com/dhrub4545",
    linkedin: "https://www.linkedin.com/in/dhrub-pandit",
    leetcode: "https://leetcode.com/u/Dhrub417183/",
    portfolioLive: "https://www.audexai.in",
    summary:
      "Nepal Engineering Council (NEC) licensed Computer Science Engineer with hands-on experience building scalable full-stack web applications using React.js, Node.js, Express.js, and MongoDB. Experienced in authentication systems (OAuth 2.0, JWT), REST API development, AI API integrations, and cloud deployment. Passionate about backend engineering, distributed systems, and building AI-powered SaaS products."
  },

  education: [
    {
      institution: "R. R. Institute of Technology, Bengaluru, India",
      degree: "B.E. in Computer Science and Engineering (VTU)",
      period: "Sep 2022 - May 2026",
      cgpa: "8.94 / 10",
      highlights: [
        "First Class with Distinction (VTU)",
        "Nepal Engineering Council (NEC) Licensed",
        "200+ LeetCode Algorithms & Data Structures Solved",
        "Focus on Distributed Systems, Cloud Computing, and Artificial Intelligence"
      ]
    }
  ],

  experience: [
    {
      company: "Karunadu Technologies Private Limited",
      role: "Python Programming & Applied Machine Learning Intern",
      period: "Feb 2026 - May 2026",
      location: "Bengaluru, India",
      certificateAvailable: true,
      bullets: [
        "Completed a professional internship focusing on Python software development and applied machine learning models.",
        "Engineered a Lung Cancer Prediction platform using supervised classification algorithms and integrated it into a Django web backend.",
        "Developed a Dry Bean Classification model to analyze and categorize bean species, performing feature scaling, extraction, and comparison of multiple classification algorithms.",
        "Applied data preprocessing, model selection, evaluation metrics (accuracy, precision, recall, F1-score), and deployment workflows to build end-to-end solutions."
      ],
      technologies: ["Python", "Django", "Machine Learning", "Scikit-Learn", "Feature Scaling", "Supervised Learning"]
    }
  ],

  projects: [
    {
      id: "audex-ai",
      title: "AUDEX AI — LLM Spend Auditing & Optimization Platform",
      period: "Jun 2026 - Sep 2026",
      category: "AI & Full Stack",
      featured: true,
      liveUrl: "https://www.audexai.in",
      githubUrl: "https://github.com/dhrub4545/Audex_AI_frontend",
      backendGithubUrl: "https://github.com/dhrub4545/Audex_AI_backend",
      technologies: ["React 19", "Node.js", "Express.js", "MongoDB", "Mongoose", "Axios", "Redis", "JWT", "OAuth 2.0", "Razorpay"],
      bullets: [
        "Engineered a full-stack SaaS platform (AUDEX AI) to optimize enterprise LLM spend by auditing subscription allocations, user seats, and API token volumes across 579+ AI models.",
        "Built interactive React interfaces featuring dynamic token calculators, side-by-side subscription vs. API savings comparisons, and visual status indicators.",
        "Integrated Google and GitHub OAuth 2.0 authentication flows directly via API routes, managing sessions using stateless JSON Web Tokens (JWT) and custom auth middleware.",
        "Implemented a robust credit-based tier restriction system (Starter, Pro, ProMax) with prioritized credit deduction logic, Redis caching, and Razorpay subscription handling."
      ]
    },
    {
      id: "quiz-generator",
      title: "LLM-Powered Automated Quiz Generation Platform",
      period: "Aug 2025 - Nov 2025",
      category: "AI & Full Stack",
      featured: true,
      liveUrl: "https://github.com/dhrub4545/quiz-Generator--main",
      githubUrl: "https://github.com/dhrub4545/quiz-Generator--main",
      frontendGithubUrl: "https://github.com/dhrub4545/mcq-main-frontend",
      technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "Google Gemini API"],
      bullets: [
        "Built a full-stack platform that generates interactive quizzes from user-provided topics using a large language model, supporting quiz creation, taking, and management workflows.",
        "Developed responsive React.js interfaces and Node.js/Express.js REST APIs for quiz generation, user authentication, and data management.",
        "Modeled quizzes, user profiles, and results in MongoDB to provide persistent storage and efficient data retrieval."
      ]
    },
    {
      id: "movietv",
      title: "MovieTV — Cinematic Video Streaming & 800+ Live IPTV",
      period: "2026",
      category: "Web Applications",
      featured: true,
      githubUrl: "https://github.com/dhrub4545/movieTV-web",
      backendGithubUrl: "https://github.com/dhrub4545/movieTV-backend",
      technologies: ["React", "Node.js", "Express", "HLS.js", "AES-128 Decryption", "Web Audio DSP"],
      bullets: [
        "High-performance media streaming platform with 100% Android TV / Web parity.",
        "Engineered stream decryptor (AES-128-CBC), IPTV M3U parser, and low-latency reverse proxy.",
        "Integrated custom low-latency HLS player with +12dB Web Audio DSP gain boost."
      ]
    },
    {
      id: "fshare-p2p",
      title: "fshare & P2P Tunnel — Zero-Storage WebRTC File Streaming",
      period: "2026",
      category: "Web Applications",
      featured: true,
      githubUrl: "https://github.com/dhrub4545/fshare",
      backendGithubUrl: "https://github.com/dhrub4545/p2p_file-transfer",
      technologies: ["WebRTC", "PeerJS", "React", "Node.js", "Socket.IO"],
      bullets: [
        "High-speed browser-to-browser file transfer with 0 MB server storage over WebRTC DataChannels.",
        "Engineered 64KB chunking, backpressure pacing, and instant QR code matchmaking.",
        "Built ephemeral 6-digit PIN signaling server for peer discovery."
      ]
    },
    {
      id: "ypss",
      title: "YPSS — Enterprise School ERP & Bilingual AI Question Engine",
      period: "2026",
      category: "Full Stack",
      featured: true,
      githubUrl: "https://github.com/dhrub4545/YPSS",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Google Gemini API"],
      bullets: [
        "Flagship educational management platform with automated Nepali fee schedules.",
        "Bilingual Gemini AI question generator with educator review workflows.",
        "Dynamic DOCX/PDF marks card overlays and school-wide announcements."
      ]
    },
    {
      id: "chat-app",
      title: "Web-Based Real-Time & AI Chat Application",
      period: "Sep 2023 - Oct 2023",
      category: "Web Applications",
      featured: false,
      githubUrl: "https://github.com/dhrub4545/Web-Based-Real-Time-AI-Chat-Application",
      technologies: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL", "Python"],
      bullets: [
        "Engineered a web chat application supporting user-to-user and user-to-AI conversations with instant message delivery.",
        "Developed a PHP-based AI chat interface and conversational workflow with responsive front end.",
        "Designed a MySQL relational schema to store user accounts, chat histories, and conversation data."
      ]
    },
    {
      id: "lung-cancer",
      title: "Lung Cancer Prediction Platform",
      period: "Feb 2026 - May 2026",
      category: "Machine Learning",
      featured: false,
      technologies: ["Python", "Django", "Scikit-Learn", "Classification Algorithms"],
      bullets: [
        "Supervised classification machine learning platform integrated into a Django backend.",
        "Analyzed clinical biomarkers to predict lung cancer risk with high precision and recall."
      ]
    },
    {
      id: "dry-bean",
      title: "Dry Bean Classification & Feature Extraction System",
      period: "Feb 2026 - May 2026",
      category: "Machine Learning",
      featured: false,
      technologies: ["Python", "Machine Learning", "Feature Scaling", "Pandas", "NumPy"],
      bullets: [
        "Engineered multi-class classification model categorizing dry bean species based on computer vision geometric traits.",
        "Conducted thorough benchmarking across multiple classification algorithms with feature scaling."
      ]
    }
  ],

  skills: {
    languages: ["JavaScript (ES6+)", "TypeScript", "Python", "C", "C++", "SQL", "PHP", "HTML5", "CSS3"],
    frontend: ["React.js (v19)", "Vite", "Tailwind CSS", "Lenis Smooth Scroll", "Floating UI", "Bootstrap", "Axios", "HLS.js"],
    backend: ["Node.js", "Express.js", "REST APIs", "Socket.IO", "WebRTC (PeerJS)", "Django", "JWT (jsonwebtoken)", "OAuth 2.0"],
    databases: ["MongoDB", "MongoDB Atlas", "Redis (ioredis)", "MySQL", "Mongoose", "Database Indexing & Schema Design"],
    ai: ["Applied Machine Learning (ML)", "Google Gemini API", "xAI / Grok 4.5", "OpenAI & Mistral APIs", "OpenRouter", "Groq API", "LLM Benchmarking", "Prompt Engineering"],
    devops: ["Docker", "Docker Volumes", "Git", "GitHub", "Vercel", "Render", "Postman", "ESLint", "Nodemon", "Node-Cron"]
  },

  stats: {
    repos: 18,
    cgpa: "8.94",
    leetcode: "200+",
    modelsBenchmarked: "579+",
    yearsCoding: "4+",
    status: "Available for Full-Time Roles & AI Projects"
  }
};

module.exports = dhrubProfile;
