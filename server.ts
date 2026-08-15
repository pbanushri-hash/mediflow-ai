import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "MediFlow AI Backend",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // 1. AI Patient Intake API
  app.post("/api/gemini/patient-intake", async (req, res) => {
    try {
      const { text, patientAge, patientGender } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Missing symptom description" });
      }

      const client = getGeminiClient();
      if (!client) {
        // Fallback rule-based structured response if no Gemini API key configured
        return res.json({
          mainComplaint: text.slice(0, 80),
          duration: "Noted by patient during intake",
          symptoms: ["Reported discomfort", "Specific pain or symptom cited"],
          severity: "Moderate (Self-reported)",
          relevantInfo: "Patient completed direct conversational check-in.",
          suggestedDepartment: text.toLowerCase().includes("heart") || text.toLowerCase().includes("chest")
            ? "Cardiology"
            : text.toLowerCase().includes("skin") || text.toLowerCase().includes("rash")
            ? "Dermatology"
            : text.toLowerCase().includes("child") || text.toLowerCase().includes("baby")
            ? "Pediatrics"
            : text.toLowerCase().includes("bone") || text.toLowerCase().includes("joint")
            ? "Orthopedics"
            : "General Medicine",
          routingReason: "Routing recommendation based on chief complaint keywords for clinical triage.",
          recommendedUrgency: text.toLowerCase().includes("severe") || text.toLowerCase().includes("chest pain")
            ? "Urgent / Emergency Triage"
            : "Standard Outpatient Visit",
          disclaimer: "MediFlow AI does not provide medical diagnoses or prescribe treatments. Please consult a qualified doctor.",
        });
      }

      const prompt = `You are MediFlow AI, an intelligent hospital intake and department routing assistant.
The patient provides the following symptom statement:
"${text}"
Additional context: Age: ${patientAge || "Adult"}, Gender: ${patientGender || "Not specified"}.

CRITICAL MEDICAL SAFETY RULES:
1. Do NOT make medical diagnoses.
2. Do NOT prescribe medications, dosages, or medical treatments.
3. Suggest an appropriate hospital department strictly for routing and consultation.
4. Extract structured details accurately.
5. Provide a reassuring, professional tone.

Return a JSON object conforming strictly to this structure:
{
  "mainComplaint": "concise phrase of chief complaint",
  "duration": "stated duration or estimated timeframe",
  "symptoms": ["list of explicit symptoms mentioned"],
  "severity": "Mild | Moderate | Needs Timely Evaluation",
  "relevantInfo": "other relevant lifestyle or contextual details from patient input",
  "suggestedDepartment": "General Medicine | Cardiology | Dermatology | Pediatrics | Orthopedics | ENT | Emergency",
  "routingReason": "Clear non-diagnostic explanation why this department can assist the patient",
  "recommendedUrgency": "Routine Consultation | Priority Outpatient | Immediate Emergency Evaluation",
  "disclaimer": "This is an AI routing intake assessment. It is not a medical diagnosis or treatment plan. A certified physician must examine you."
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are MediFlow AI, a hospital intake and routing triage system. You must never diagnose diseases or prescribe medicine.",
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (error: any) {
      console.error("Error in /api/gemini/patient-intake:", error);
      return res.status(500).json({ error: error.message || "Failed to process patient intake" });
    }
  });

  // 2. Medical Report Explainer API
  app.post("/api/gemini/explain-report", async (req, res) => {
    try {
      const { reportText, reportType, imageBase64, mimeType } = req.body;

      const client = getGeminiClient();
      if (!client) {
        return res.json({
          reportTitle: reportType || "Clinical Laboratory / Diagnostic Report",
          summary: "This report contains clinical diagnostic values and parameters intended for clinician interpretation.",
          keyFindings: [
            {
              term: "Complete Blood Count (CBC)",
              explanation: "A standard test measuring red blood cells, white blood cells, and platelets to evaluate overall health status.",
              value: "Normal Range Reference Provided",
              status: "Informational",
            },
            {
              term: "Hemoglobin (Hb)",
              explanation: "A vital iron-rich protein in red blood cells that carries oxygen from your lungs throughout your body.",
              value: "13.8 g/dL",
              status: "Within standard reference boundaries",
            },
            {
              term: "Erythrocyte Sedimentation Rate",
              explanation: "A non-specific marker that indicates the presence of inflammation in the body.",
              value: "Standard test indicator",
              status: "Review with Doctor",
            },
          ],
          questionsForDoctor: [
            "How do these results correlate with my current symptoms?",
            "Are any lifestyle or dietary adjustments recommended?",
            "When should I schedule follow-up blood work or diagnostic imaging?",
          ],
          disclaimer: "MediFlow AI provides plain-language definitions only. It does not diagnose conditions or modify therapies. Share all original reports with your doctor.",
        });
      }

      let contents: any = [];
      const promptText = `You are MediFlow AI, an intelligent healthcare report explainer.
Explain the following medical report in plain, easy-to-understand English for the patient:

Report Type: ${reportType || "General Diagnostic Report"}
Report Content:
${reportText || "Standard blood panel and biochemical metabolic indicators."}

STRICT SAFETY MANDATES:
1. Do NOT diagnose any diseases or conditions.
2. Do NOT tell the patient to start, stop, or change any medication.
3. Do NOT make definitive claims about normalcy without explicit doctor consultation.
4. Translate complex medical acronyms and jargon into simple educational descriptions.

Return JSON with this schema:
{
  "reportTitle": "Clear title of the report",
  "summary": "2-3 sentences plain English summary of what the test was measuring",
  "keyFindings": [
    {
      "term": "Medical term or test name",
      "explanation": "Simple plain-English explanation of what this marker does",
      "value": "Value or result mentioned in report",
      "status": "Educational interpretation (e.g., 'Requires Doctor Review', 'Standard Value', 'Biomarker Indicator')"
    }
  ],
  "questionsForDoctor": [
    "Suggested question 1 for patient to ask their doctor",
    "Suggested question 2",
    "Suggested question 3"
  ],
  "disclaimer": "This explanation is educational and does not replace medical consultation. Always review diagnostic results with your healthcare provider."
}`;

      if (imageBase64 && mimeType) {
        contents = {
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType,
              },
            },
            { text: promptText },
          ],
        };
      } else {
        contents = promptText;
      }

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: contents,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are an educational medical explainer. Explain complex terminology simply without diagnosing or prescribing.",
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (error: any) {
      console.error("Error in /api/gemini/explain-report:", error);
      return res.status(500).json({ error: error.message || "Failed to explain report" });
    }
  });

  // 3. Doctor AI Patient Summary API
  app.post("/api/gemini/doctor-summary", async (req, res) => {
    try {
      const { patientData } = req.body;
      if (!patientData) {
        return res.status(400).json({ error: "Missing patient data" });
      }

      const client = getGeminiClient();
      if (!client) {
        return res.json({
          patientInfo: `${patientData.name || "Patient"}, Age: ${patientData.age || "N/A"}, ID: ${patientData.id || "PID-000"}`,
          currentComplaint: patientData.chiefComplaint || "Routine follow-up consultation",
          relevantHistory: patientData.medicalHistory?.join(", ") || "No significant chronic ailments recorded in chart.",
          previousVisits: patientData.previousVisitsSummary || "Last seen 3 months ago for annual checkup.",
          uploadedReportsSummary: patientData.recentReportsSummary || "CBC and Metabolic panel available in records.",
          keyItemsForClinicianReview: [
            "Verify onset timeline of acute symptoms",
            "Check tolerance of current maintenance medications",
            "Evaluate vital signs taken at nursing intake",
          ],
          disclaimer: "AI-generated administrative/clinical summary — verify all information before clinical use.",
        });
      }

      const prompt = `You are MediFlow AI, a clinical assistant summarizing patient data for an attending physician.
Patient Data:
${JSON.stringify(patientData, null, 2)}

TASK:
Produce a concise, structured administrative and clinical intake summary for the physician before they enter the consultation room.

RULES:
1. Do NOT diagnose or suggest medical treatment prescriptions.
2. Structure the information into clean, high-signal categories.
3. Highlight high-priority items requiring clinician verification.

Return JSON in this format:
{
  "patientInfo": "One-line demographics (Name, Age, Gender, ID)",
  "currentComplaint": "Concise summary of presenting symptoms and duration",
  "relevantHistory": "Summary of prior illnesses, allergies, and ongoing medications",
  "previousVisits": "Summary of recent hospital encounters or consultations",
  "uploadedReportsSummary": "Summary of recent lab tests or diagnostic reports on file",
  "keyItemsForClinicianReview": [
    "High priority item 1 to verify",
    "High priority item 2",
    "High priority item 3"
  ],
  "disclaimer": "AI-generated administrative/clinical summary — verify information before clinical use."
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are a clinical documentation assistant for doctors. Summarize factual information objectively without making diagnostic claims.",
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (error: any) {
      console.error("Error in /api/gemini/doctor-summary:", error);
      return res.status(500).json({ error: error.message || "Failed to generate doctor summary" });
    }
  });

  // 4. Hospital FAQ & Wayfinding Assistant API
  app.post("/api/gemini/hospital-faq", async (req, res) => {
    try {
      const { query } = req.body;
      const client = getGeminiClient();

      const hospitalDirectory = `
Hospital Directory:
- Ground Floor: Reception (Room 101), Emergency (Block A, Room 102), Pharmacy (Block C, Room 105), Billing & Registration (Lobby)
- First Floor: General Medicine (Block A, Rooms 201-205), Pediatrics (Block B, Rooms 206-210), Dermatology (Block C, Rooms 211-215)
- Second Floor: Cardiology (Block A, Rooms 301-305), Diagnostic Laboratory (Block B, Room 306), Radiology / X-Ray / MRI (Block C, Room 310)
- Third Floor: Surgery Theatres, Intensive Care Unit (ICU), Inpatient Wards (Rooms 401-440)
Visiting Hours: 10:00 AM - 1:00 PM and 4:30 PM - 7:30 PM.
Emergency: Open 24/7.
`;

      if (!client) {
        const q = (query || "").toLowerCase();
        let location = "Hospital Main Reception, Ground Floor";
        if (q.includes("lab") || q.includes("blood") || q.includes("test")) {
          location = "Diagnostic Laboratory → Second Floor → Block B → Room 306";
        } else if (q.includes("x-ray") || q.includes("mri") || q.includes("radiology") || q.includes("scan")) {
          location = "Radiology & Imaging → Second Floor → Block C → Room 310";
        } else if (q.includes("emergency") || q.includes("trauma") || q.includes("urgent")) {
          location = "Emergency & Trauma Center → Ground Floor → Block A → Room 102 (24/7)";
        } else if (q.includes("pharmacy") || q.includes("medicine")) {
          location = "Central Hospital Pharmacy → Ground Floor → Block C → Room 105";
        } else if (q.includes("cardio") || q.includes("heart")) {
          location = "Cardiology Department → Second Floor → Block A → Room 301";
        } else if (q.includes("pediatric") || q.includes("child")) {
          location = "Pediatrics Department → First Floor → Block B → Room 206";
        } else if (q.includes("skin") || q.includes("derma")) {
          location = "Dermatology Clinic → First Floor → Block C → Room 211";
        }

        return res.json({
          answer: `For "${query}": Please proceed to ${location}.`,
          location: location,
          visitingHours: "10:00 AM - 1:00 PM and 4:30 PM - 7:30 PM",
        });
      }

      const prompt = `You are MediFlow AI's Hospital Wayfinding & FAQ assistant.
Based on the following Hospital Directory:
${hospitalDirectory}

Answer the user's question: "${query}".
Provide a concise, helpful response with exact Floor, Block, and Room numbers if asking about a department.
Return JSON:
{
  "answer": "Clear friendly answer to the user's query",
  "location": "Exact path e.g. Department Name → Floor → Block → Room",
  "additionalInfo": "Helpful notes like opening hours or pre-requisite steps"
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (error: any) {
      console.error("Error in /api/gemini/hospital-faq:", error);
      return res.status(500).json({ error: error.message || "Failed to answer hospital FAQ" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediFlow AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
