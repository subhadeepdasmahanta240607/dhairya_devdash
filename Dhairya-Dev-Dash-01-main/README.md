<div align="center">

# 🌸 Dhairya (ধৈৰ্য / धैर्य)
### *AI-Powered Cognitive Care & Memory Companion Ecosystem for Elderly Dementia Patients*

<br/>

[![React 19](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![PWA Offline-First](https://img.shields.io/badge/PWA-Workbox%20%2B%20IndexedDB-purple.svg)](https://web.dev/progressive-web-apps/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas%20Cloud-47A248.svg)](https://www.mongodb.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-Multimodal%20AI-8E75B2.svg)](https://deepmind.google/technologies/gemini/)
[![DPDP Act 2023](https://img.shields.io/badge/DPDP%20Act%202023-Compliant-success.svg)](https://dhairya-puce.vercel.app/privacy-policy)
[![WebAuthn FIDO2](https://img.shields.io/badge/WebAuthn-FIDO2%20Biometrics-orange.svg)](https://webauthn.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<p align="center">
  <b>Dhairya</b> is an evidence-based, culturally grounded cognitive care platform bridging elderly dementia patients, family caregivers, and clinicians — uniting an <b>offline-first PWA</b>, <b>5 culturally attuned cognitive games</b>, <b>multilingual voice synthesis</b> (Assamese, Hindi, English), <b>Google Gemini AI</b>, a <b>Meta WhatsApp companion bot</b>, and a <b>live Machine Learning telemetry engine</b> on Render.
</p>

</div>

---

## 1. Project Information

| Field | Details |
|---|---|
| **Project Title** | Dhairya — AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients |
| **PS ID** | SIH26003 |
| **PS Title** | AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients in NER |
| **Category** | Software |
| **Theme** | MedTech / BioTech / HealthTech |
| **Nodal Ministry** | Ministry of Development of North Eastern Region (MDoNER) |


---

## 2. Problem Statement

Over **8.8 million Indians** live with dementia (2026), with **280,000–350,000 cases** concentrated in India's 8 North-Eastern states. The NER faces a uniquely severe crisis:

- 🏥 **85%+ of neurologists** operate exclusively out of Guwahati — rural hill-state patients have near-zero specialist access.
- 🌧️ **Mountainous terrain and monsoon floods** sever physical access to healthcare. 2G/3G internet causes cloud-dependent apps to crash mid-session.
- 🗣️ **220+ indigenous dialects** (Assamese, Bodo, Khasi, Mizo) make standard Western cognitive tests medically invalid for NER demographics.
- 😶 **Cultural stigma** causes over 90% of families to dismiss early memory loss as normal aging (*"বুঢ়া বয়সৰ পাহৰণি"*), resulting in diagnosis only at advanced Stage 3 or 4.
- 📱 **No existing app** offers offline-first operation, multilingual Assamese voice guidance, and culturally grounded cognitive exercises for NER elderly patients.

---

## 3. Proposed Solution

**Dhairya** is a resilient **3-Tier Delivery Ecosystem**:

| Tier | Channel | Reach |
|---|---|---|
| **Tier 1 (Core)** | Offline-first PWA + Meta WhatsApp AI companion bot | Any smartphone, even 2G |
| **Tier 2 (Fallback)** | IVR automated voice calls + SMS alerts | Feature phones without internet |
| **Tier 3 (Field Care)** | ASHA worker tablet mode with local sync | Door-to-door community screening |

The platform delivers:
1. 🎮 **5 culturally attuned cognitive games** targeting distinct neuroanatomical pathways using authentic NER assets (Kaji Nemu, Bhut Jolokia, Assamese Dhol, Pepa horn, Mekhela patterns).
2. 🗣️ **Multilingual voice guidance** in Assamese (`as-IN`), Hindi (`hi-IN`), and English — with Google Gemini AI conversational companion.
3. 📱 **Meta WhatsApp Cloud API bot** for automated medication reminders and bidirectional patient check-ins — zero new app learning curve.
4. 🧠 **Live Machine Learning microservice** (Python + FastAPI on Render) for real-time adaptive game difficulty and longitudinal cognitive health scoring (0–100).
5. 🩺 **Clinical Caregiver Dashboard** with 7-day adherence charts, red-flag overdue medication alerts, and exportable cognitive telemetry.
6. 📶 **100% offline-first PWA** (Workbox + IndexedDB) — full functionality during complete internet outages.
7. 🔐 **WebAuthn FIDO2 biometrics** — hardware fingerprint/face login without passwords, compliant with DPDP Act 2023.

---

## 4. Key Features

| Feature | Description |
|---|---|
| 🔑 **Biometric Login** | Tactile 4-digit PIN + WebAuthn FIDO2 hardware fingerprint/face authentication |
| 📅 **Horizon Routines** | Chronological daily schedule with audio read-aloud and 1-tap completion |
| 🎮 **5 Cognitive Games** | Market Day Basket, Daily Routine Sequencer, Faces & Family Recall, Sound & Rhythm Match, Odd One Out |
| 🤖 **Gemini AI Assistant** | Multimodal conversational assistant — text + voice, grounded in patient's live data |
| 📲 **WhatsApp Bot** | Automated bilingual medication reminders with bidirectional patient sync |
| 🧠 **Live ML Engine** | Adaptive difficulty + 0–100 cognitive health score + clinical status label |
| 📸 **Memory Bank** | Family photo reminiscence vault with DPDP Act 2023 consent trails |
| 🩺 **Caregiver Hub** | Real-time patient roster, red-flag alerts, reaction-time charts |
| 📶 **Offline PWA** | Service worker pre-caching + IndexedDB queue + automatic background sync |
| 🛡️ **DPDP Compliant** | Consent checkboxes, 30-day right to erasure, zero raw biometric storage |

---

## 5. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19.2, Vite 8.2, React Router v7, Tailwind CSS v4, Lucide React, i18next, Recharts |
| **Offline PWA** | `vite-plugin-pwa`, Workbox Service Worker, IndexedDB (`idb`) |
| **Voice & Speech** | Web Speech Synthesis API — Assamese, Hindi, English |
| **Generative AI** | Google Gemini AI SDK (`@google/genai`) — multimodal text + voice |
| **Machine Learning** | Python, Scikit-Learn, FastAPI — hosted on Render Cloud |
| **Backend API** | Node.js, Express.js, Mongoose ODM, Node-Cron, bcrypt, JWT |
| **Database** | MongoDB Atlas Cloud |
| **APIs** | Meta WhatsApp Business Cloud API · Google OAuth 2.0 · Bhashini API (NER language TTS) |
| **Security & Auth** | WebAuthn FIDO2 · bcrypt PIN hashing · DPDP Act 2023 |
| **Deployment** | Vercel (Frontend) · Render (Backend & ML) · MongoDB Atlas (Database) |

---

## 6. Architecture

```text
                         ┌────────────────────────────────────┐
                         │    Senior Patient / Family Caregiver│
                         └──────────┬──────────────┬──────────┘
                                    │              │
               React 19 PWA (Offline-First + IDB)  WhatsApp (Meta Cloud API)
                                    │              │
                                    ▼              ▼
                         ┌──────────────────────────────────────────┐
                         │         Express.js REST & Webhook API     │
                         │  ├─ JWT & WebAuthn FIDO2 Auth             │
                         │  ├─ Dynamic Routine & Alert Engine        │
                         │  ├─ Cognitive Telemetry Logging           │
                         │  ├─ ML Service Proxy & Fallback Wrapper   │
                         │  └─ Node-Cron Reminder Scheduler          │
                         └────────┬───────────────┬──────────────┬──┘
                                  │               │              │
                                  ▼               ▼              ▼
                         ┌────────────────┐ ┌──────────────┐ ┌──────────────────┐
                         │  MongoDB Atlas │ │ Google Gemini│ │  ML Engine (AI)  │
                         │  · Patients   │ │ · Generative │ │  · Adaptive Diff.│
                         │  · Reminders  │ │   Companion  │ │  · Health Score  │
                         │  · GameLogs   │ │ · Voice Audio│ │  (Render Cloud)  │
                         │  · Caregivers │ └──────────────┘ └──────────────────┘
                         └────────────────┘
```

---

## 7. Repository Structure

```text
Dhairya/
├── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── patient/          # Patient portal + 5 cognitive games
│   │   │   └── caregiver/        # Caregiver dashboard + telemetry
│   │   ├── services/             # API service layer (api.js)
│   │   ├── context/              # Auth & patient context providers
│   │   └── utils/                # speechUtils, gameHelpers
│   ├── index.html
│   └── vite.config.js
├── backend/
│   ├── server.js                 # Express entry point + keep-alive pinger
│   ├── routes/                   # patientRoutes, caregiverRoutes, gameRoutes
│   ├── models/                   # Mongoose schemas (Patient, Caregiver, GameSession)
│   ├── services/                 # mlService.js, translationService.js
│   ├── jobs/                     # reminderCron.js (Node-Cron scheduler)
│   └── middleware/               # JWT auth, rate limiting
└── docs/
    └── screenshots/              # UI gallery — all 18 screens
```


---

## 11. Installation

```bash
git clone https://github.com/gopalrajlohiya11-ui/Dhairya.git
cd Dhairya

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

**`backend/.env`**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/Dhairya
JWT_SECRET=your_jwt_super_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
WHATSAPP_TOKEN=your_meta_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_verify_token
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

## 12. Run

```bash
# Terminal 1 — Backend
cd backend
node seed.js   # First time only — seeds demo data
npm start      # http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev    # http://localhost:5173
```

---

## 13. Future Scope

| Phase | Milestone |
|---|---|
| 🏥 **Phase 1** | Government Tele-MANAS (14416) integration — automatic specialist referrals from remote NER districts |
| 👩‍⚕️ **Phase 2** | ASHA & Frontline Worker Tablet Suite with voice prompts in Bodo, Khasi, Garo, Mizo, Meitei, Nagamese |
| 🎙️ **Phase 3** | Acoustic Speech Biomarker Analysis via openSMILE — micro-cognitive decline detection from voice patterns |
| ⌚ **Phase 4** | Wearable PPG & Vascular Risk Telemetry — Bluetooth smart band integration for continuous BP/HR monitoring |
| 🎮 **Phase 5** | 6 additional cognitive games — Village Path Navigator, Spice Sorter, Proverb Completer, and more |
| 🔬 **Phase 6** | Multi-centric ICMR & ARDSI clinical validation trials — 500+ NER patients over 12 months |

---

## Team

<div align="center">

**Team InBESTigation** — Smart India Hackathon 2026 · SIH26003 · AIT Pune Dev Dash

| # | Name |
|:---:|:---|
| 1 | **Shrish Nayak** |
| 2 | **Shivam Jadon** |
| 3 | **Vivek Tiwari** |
| 4 | **Subhadeep Das Mahanta** |

</div>

---
