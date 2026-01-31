# 🧠 DoseWise

**An Autonomous AI Agent for Medication Management & Elder Care**

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2+-61dafb.svg)](https://reactjs.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Latest-orange.svg)](https://github.com/langchain-ai/langgraph)

---

## Overview

DoseWise is an **agentic AI system** designed to autonomously manage daily medication routines for elderly and chronically ill patients. Unlike reminder apps or chatbots, DoseWise **observes, reasons, plans, and acts** on its own to ensure the right medicine is taken at the right time — while proactively managing inventory, health signals, and caregiver alerts.

---

## 🚨 Problem Statement

Millions of elderly patients take multiple medications daily for chronic conditions such as:

- **Heart disease**
- **Diabetes**
- **Urology-related issues**

### Challenges They Face:

- ❌ Identifying the correct medicine
- ❌ Remembering dosage and timing
- ❌ Tracking remaining pills
- ❌ Reordering medicines on time
- ❌ Monitoring basic health vitals consistently

> **Critical Issue:** Missed or incorrect medication intake can lead to serious health risks.

---

## 💡 Solution Overview

DoseWise acts as a **digital caretaker** — an autonomous AI agent that continuously monitors medication schedules and patient interactions, makes decisions, and takes actions with minimal human input.

### Key Principles

- ✅ **Agentic** (not reactive)
- ✅ **Goal-driven**
- ✅ **Explainable decisions**
- ✅ **Designed for real-world use**
- ✅ **No medical diagnosis or prescription**

> ⚠️ **Disclaimer:** DoseWise does not prescribe medication. It strictly follows doctor-prescribed schedules provided during setup.

---

## 🧠 Agentic Architecture

DoseWise operates in a continuous loop:

```
Observe → Reason → Plan → Act → Verify → Learn
```

### Core Goal

> *"Ensure the patient takes the correct medicine, in the correct dosage, at the correct time — and proactively handle shortages and health signals."*

---

## 📁 Project Structure

```
dosewise/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI entry point
│   │   ├── api/                     # REST routes & schemas
│   │   ├── agent/                   # LangGraph agent logic
│   │   │   ├── graph.py              # Agent graph definition
│   │   │   ├── state.py              # Agent state schema
│   │   │   ├── observer.py           # Observe node
│   │   │   ├── reasoning.py          # Reason node
│   │   │   ├── planner.py            # Plan node
│   │   │   └── action.py             # Act node
│   │   ├── medication/              # Medication logic
│   │   ├── health/                  # Vitals & trend analysis
│   │   ├── reorder/                 # Reorder & pharmacy search
│   │   ├── notifications/           # Reminders & escalation
│   │   └── storage/                 # Persistent agent state
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/                   # Dashboard, Setup, Caregiver
│   │   ├── components/              # UI components
│   │   ├── services/                # API client
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## 🤖 Agent Responsibilities

### 🔍 Observer Agent
- Tracks time, medication schedules, and missed doses
- Monitors pill inventory and health vitals

### 🧠 Reasoning Agent
- Determines if a dose is missed
- Detects low inventory
- Identifies abnormal health trends

### 🗺️ Planner Agent
Decides next best actions:
- Send reminder
- Escalate to caregiver
- Initiate medicine reorder
- Suggest doctor consultation

### ⚡ Action Agent
- Sends reminders (UI / notifications)
- Displays pill image, dosage & instructions
- Triggers reorder flow
- Logs every action for transparency

---

## ✨ Key Features

### 💊 Smart Medication Assistance
- ⏰ Time-based reminders
- 🖼️ Pill image + name + dosage
- 📋 Instructions (before/after food)
- 🚨 Missed-dose detection with escalation

### 📦 Inventory Tracking
- 📉 Automatic pill count decrement
- ⚠️ Low-stock alerts
- 🔄 Proactive reorder suggestions

### 🛒 Medicine Reordering (Semi-Autonomous)
- 🔍 Searches online pharmacies
- 💰 Compares prices
- ✅ Requests user confirmation before ordering

### 🩺 Daily Health Check-ins
Manual input for:
- Blood pressure
- Blood sugar
- Weight

Includes basic trend analysis to detect anomalies.

### 👨‍👩‍👧 Caregiver Visibility
- 📊 Missed doses tracking
- ⚠️ Inventory warnings
- 📈 Health summaries

🧪 Demo Scenario (Hackathon Flow)

System detects it’s 8:00 AM

Agent decides a medicine is due

UI shows:

Pill image

Dosage

Instructions

User confirms intake

Inventory auto-updates

Agent detects low stock

Reorder flow is triggered

Caregiver is notified only if needed

The user never asks “what next?” — the agent decides.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python, FastAPI |
| **Agent Framework** | LangGraph (LangChain) |
| **LLM** | Gemini / OpenAI (reasoning placeholders included) |
| **State Management** | JSON / SQLite |
| **Frontend** | React (mobile-first design) |

---

## 🚀 Setup Instructions

### Backend

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```

The backend will be available at: `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: `http://localhost:3000`

---

## 🧠 Why This Is Agentic (Not a Chatbot)

| Aspect | DoseWise |
|--------|----------|
| **User-driven** | ❌ |
| **Goal-driven** | ✅ |
| **Autonomous actions** | ✅ |
| **Continuous loop** | ✅ |
| **Explainable decisions** | ✅ |
| **Real-world impact** | ✅ |
---

## 👥 Team

Built by a team of **4 engineers** as part of an **Agentic AI Hackathon**, with parallel development across:

- 🏗️ Agent architecture & LangGraph
- 💊 Medication & health logic
- 🔔 Notifications & reordering
- 🎨 Frontend & demo experience

---

## 🔮 Future Scope

- 🎤 Voice-first interface for elderly users
- 📸 OCR-based pill recognition
- ⌚ Wearable integration
- 🏥 Secure caregiver & doctor dashboards
- 🌍 Multilingual support

---

## 🏁 Conclusion

**DoseWise is more than a reminder app** — it is an autonomous AI caretaker that reduces cognitive load, prevents mistakes, and improves daily health outcomes for those who need it most.

---

## 📝 Next Steps

1. Configure LLM API keys in `.env`
2. Initialize medication schedules
3. Start the agent loop
4. Access the dashboard via the React frontend

---

**Made with ❤️ for better elderly care**