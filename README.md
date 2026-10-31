# ProfessorX — Your Notes Interrogate You
> **An Adaptive AI Oral-Exam Simulator for Track 1: Applied AI & Next-Gen Autonomous Agents**

[![Next.js](https://img.shields.io/badge/Next.js-16%20(App%20Router)-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Google Gemini Flash](https://img.shields.io/badge/Google%20Gemini-Flash%20(Structured%20Outputs)-4285F4?style=flat&logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Track](https://img.shields.io/badge/Track%201-Applied%20AI%20%26%20Next--Gen%20Agents-8B5CF6?style=flat)]()

---

## ⚡ Overview
**ProfessorX** is an autonomous AI oral-examiner designed to eliminate passive learning. Instead of generating a generic multi-choice quiz, ProfessorX acts as an adversarial academic interrogator:
1. **Ingests & Dissects Study Notes:** Upload a PDF/TXT or paste raw notes to extract core axioms, topological concept maps, and examinable gaps.
2. **Runs an Adaptive Interrogation Gauntlet:** Questions span multiple modalities (MCQ with cognitive traps, True/False edge cases, and semantically graded Short Answers).
3. **Dynamic Cognitive Calibration:** 
   - 2 consecutive correct answers $\rightarrow$ increases difficulty (`Foundation` $\rightarrow$ `Applied` $\rightarrow$ `Expert`).
   - 2 consecutive incorrect answers $\rightarrow$ demotes difficulty and re-anchors on foundational principles.
   - Repeated topic failures $\rightarrow$ prioritizes vulnerable domains.
4. **Misconception Detection:** Dissects not just whether an answer is wrong, but the *implicit false assumption* that caused the error.
5. **Diagnostic Weakness Report & Actionable Repair Plan:** Delivers a definitive letter grade (**S / A / B / C / D**), a live Topic-Mastery Radar chart, exposed misconception logs, and targeted practice challenges with toggleable solutions.

---

## 🏆 Track 1 Alignment: Applied AI & Next-Gen Agents
- **Autonomous Multi-Stage Cognitive Loop:** ProfessorX operates as a multi-step agent coordinating 4 distinct structured reasoning phases: `Material Ingestion` $\rightarrow$ `Adaptive Question Generation` $\rightarrow$ `Semantic Evaluation & Misconception Diagnosis` $\rightarrow$ `Diagnostic Synthesis & Repair Planning`.
- **Strict Grounding In Note Material:** Strictly constrains questions and answers to the student's ingested material, eliminating hallucinated external facts.
- **Semantic Answer Evaluation:** Short-answer grading evaluates conceptual reasoning, causal mechanisms, and technical accuracy rather than simplistic string matching.
- **Zero-Failure Demo Shield:** Built-in resilience layer that uses Google Gemini Flash when `GEMINI_API_KEY` is present and smoothly falls back to a high-fidelity simulation engine if an API key is omitted or rate limits are reached during a live demo.

---

## 🎨 Visual Aesthetics & Audio Architecture
- **Near-Black Cinematic Sci-Fi Palette:** `#05060A` backdrop with reactive `#8B5CF6` electric violet and `#22D3EE` neon cyan radial lighting.
- **Glassmorphism HUD:** Translucent dark panels with `backdrop-blur-xl`, `border-white/10`, and ambient moving telemetry grid.
- **Dynamic Holographic Examiner Avatar:** Reactive SVG avatar that dynamically shifts expressions (`neutral`, `skeptical`, `intrigued`, `disappointed`, `merciless`, `impressed`) and displays real-time speech reactions.
- **Web Audio API Synthesizer:** Pure browser-native sound design (holographic scan hums, timer tension heartbeat ticks, harmonious correct chimes, glitch buzzer tones, and epic sub-bass grade reveal sweeps) with an instant mute toggle.

---

## 🚀 Quickstart & Setup

### 1. Prerequisites
- Node.js `v18+` or `v20+` (verified on Node `v24.20.0`)
- npm `v9+` or `v11+`

### 2. Installation
```bash
git clone <repo-url>
cd "teen tatte hackathon"
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the project root:
```env
# Google Gemini Flash API Key (Never exposed client-side)
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
> *Note: If `GEMINI_API_KEY` is left blank, ProfessorX automatically activates the **Zero-Failure Demo Shield**, providing a 100% realistic, high-fidelity simulated interrogation experience.*

### 4. Running the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Production Build Verification
```bash
npm run build
npm start
```

---

## ⏱️ 3-Minute Live Hackathon Demo Script

### Minute 1: Ingestion & Neural Scanning (0:00 – 1:00)
1. **Landing Bay:** Open `http://localhost:3000`. Show the dark, cinematic UI.
2. **1-Click High-Yield Preset:** Click the **"Distributed Systems & Raft Consensus"** demo preset. Point out that the notes, subject, and concepts are loaded in 1 second.
3. **Configure Examiner:**
   - Select **"The Ruthless Examiner"** (*"Your notes are riddled with blind spots. Let us illuminate them."*).
   - Set **Intensity** to **"Brutal"** (18s timer, high pressure).
4. **Begin Interrogation:** Click `Begin Interrogation`.
5. **Neural Scan:** Watch the 4–6 second holographic scanning animation with audio telemetry (*"Ingesting study material..."* $\rightarrow$ *"Mapping core concepts..."* $\rightarrow$ *"Identifying examinable gaps..."* $\rightarrow$ *"ProfessorX is ready."*).

### Minute 2: Adaptive Interrogation & Misconception Diagnosis (1:00 – 2:15)
1. **Show the 3-Column Command Layout:**
   - **Left:** The Inquisitor avatar, mood tag, and live Pressure Meter (rising with tension).
   - **Center:** Active question, topic chip, difficulty badge, and countdown timer.
   - **Right:** Live Recharts Topic-Mastery Radar chart and streak counter.
2. **First Answer (Correct):** Click Option B (`3 votes`) and click `Submit Defense`.
   - Hear harmonious chime, green pulse, and examiner line (*"Acceptable. You avoided the obvious blunder."*).
   - Watch the difficulty promote to `Applied` and the radar chart expand.
3. **Second Answer (Wrong / Edge Case):** Select an incorrect option or intentionally trigger a trap.
   - Watch the subtle red glitch shake, pressure gauge climb into amber/crimson, and the **Misconception Card** reveal:
     - *"What you assumed vs. The physical/logical reality"*.

### Minute 3: Final Weakness Report & Actionable Repair Plan (2:15 – 3:00)
1. Complete the remaining questions to reach the **Final Diagnostic Debrief**.
2. **Grade Reveal:** Watch the animated grade reveal (S / A / B / C / D) with celebration effects.
3. **Diagnostic Breakdown:**
   - Review overall score %, tested mastery radar, and strongest vs. weakest domains.
   - Examine the **Misconceptions Exposed** log.
4. **Actionable Repair Plan:**
   - Scroll to the personalized repair plan items.
   - Click `Reveal Solution` on a practice question to view the full answer and hint.
   - Click `Copy Revision Plan` to see the `"Plan Copied!"` toast.
   - Click `Download Markdown` to download the formatted `.md` report for offline study.

---

## 📁 Repository Structure
```
├── app/
│   ├── api/
│   │   └── ai/
│   │       ├── analyze/route.ts            // Note ingestion & concept mapping
│   │       ├── generate-question/route.ts  // Contextual question generator
│   │       ├── evaluate-answer/route.ts    // Semantic evaluator & misconception detector
│   │       └── generate-report/route.ts    // Comprehensive weakness debrief & repair plan
│   ├── globals.css                         // Design tokens, glassmorphism, animations
│   ├── layout.tsx                          // Root layout & SEO metadata
│   └── page.tsx                            // Main state machine orchestrator
├── components/
│   ├── common/
│   │   └── HeaderHUD.tsx                   // Status HUD, telemetry badge, audio toggle
│   ├── landing/
│   │   ├── IntakeBay.tsx                   // Notes intake, file dropzone, exam parameters
│   │   ├── PersonaSelector.tsx             // 3 Examiner personas
│   │   └── PresetSelector.tsx              // 1-Click high-yield demo presets
│   ├── transition/
│   │   └── NeuralScan.tsx                  // 4-6s cinematic holographic scanner
│   ├── interrogation/
│   │   ├── InterrogationRoom.tsx           // 3-Column desktop layout
│   │   ├── ExaminerAvatar.tsx              // Holographic reactive SVG face & mood bubble
│   │   ├── PressureGauge.tsx               // Live room pressure meter
│   │   ├── QuestionConsole.tsx             // Question console, timer, answer options
│   │   └── MasteryRadar.tsx                // Live Recharts radar & telemetry stats
│   └── report/
│       └── FinalReport.tsx                 // Grade stamp, weakness diagnostics & repair plan
├── lib/
│   ├── audio.ts                            // Web Audio API sci-fi synthesizer
│   ├── gemini.ts                           // Gemini Flash client with structured outputs
│   ├── mockData.ts                         // Presets & zero-failure demo simulation engine
│   ├── adaptiveEngine.ts                   // Adaptive rules engine & difficulty calculus
│   ├── pdfParser.ts                        // Safe client-side file & PDF parser
│   ├── markdownExporter.ts                 // Markdown report generator & downloader
│   └── types.ts                            // Strict TypeScript definitions
├── .env.example
├── .env.local
└── README.md
```

---

## 🔒 Security & Privacy
- `GEMINI_API_KEY` is strictly managed server-side via Next.js API Routes and is never bundled in client code or browser network payloads.
- Study notes are processed in-memory for the duration of the exam session and are not stored in any external database.
