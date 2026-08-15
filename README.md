# MediFlow AI — Intelligent Hospital Assistance & Patient Flow Management

> **Smarter Hospital Assistance. Simpler Patient Care.**

MediFlow AI is an enterprise-grade hospital assistance, intelligent triage, and outpatient patient flow platform engineered in React, Vite, Tailwind CSS, TypeScript, and Google Gemini API.

---

## 🌟 Key Functional Modules

### 1. Patient Portal
- **AI Patient Intake**: Conversational symptom input parsing structured chief complaints, duration, and recommended hospital departments for clinical outpatient consultation.
- **Smart Outpatient Appointments**: Seamless scheduling matching patient needs to consulting doctors, hospital rooms, and real-time token numbers.
- **Live Digital Token & Queue Tracker**: Real-time token status, queue position, dynamic wait-time estimations, and interactive queue simulation.
- **Medical Report Explainer**: Plain-language AI translations for complex diagnostic panels (CBC, Comprehensive Metabolic Panel, Lipid profile) with questions to ask your doctor.
- **Campus Wayfinding & Navigation**: Floor-by-floor room directory with interactive routing, block locations, and step-by-step directions.

### 2. Doctor Portal
- **Clinical Dashboard**: Real-time outpatient queue overview, active waiting patients, and completed consultation tracking.
- **AI Pre-Consult Patient Summaries**: Structured clinical synthesis extracting presenting complaint, documented medical history, active medications, allergy flags, and diagnostic highlights before consults.
- **Clinical Note & Prescription Engine**: Recording of examination findings, medication orders, and digital discharge.

### 3. Hospital Admin Portal
- **Executive Operations Dashboard**: Recharts-powered analytics for hourly patient inflow trends, department workload distribution, and appointment status metrics.
- **Hospital Resource Management (CRUD)**: Complete administration for doctors, clinical departments, appointments, hospital rooms, and patient records.

---

## 🛡️ Medical AI Safety & Regulatory Compliance

- **Non-Diagnostic Policy**: MediFlow AI assists administrative intake, queue optimization, and healthcare navigation. It does **NOT** provide medical diagnoses or prescribe medications.
- **Mandatory Clinician Verification**: All AI-generated triage summaries and report explanations clearly display disclaimer notices and require certification by a licensed healthcare professional.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React icons, Recharts
- **State Management**: React Context (`HospitalContext`) providing reactive state with localStorage backup and modular hooks for Firestore/Firebase Auth migration.
- **Backend & AI**: Express server (`server.ts`) proxying requests to the `@google/genai` TypeScript SDK (`gemini-2.5-flash`), securing API keys server-side.

---

## 🚀 Getting Started

### Development
```bash
# Start fullstack Vite + Express server
npm run dev
```

### Production Build
```bash
# Build frontend and bundle server
npm run build
npm start
```
