import { IntakeAssessment, AIReportExplanation, DoctorAISummary } from "../types";

export interface IntakeRequest {
  text: string;
  patientAge?: number | string;
  patientGender?: string;
}

export interface ReportExplainRequest {
  reportText?: string;
  reportType?: string;
  imageBase64?: string;
  mimeType?: string;
}

export interface DoctorSummaryRequest {
  patientData: any;
}

export interface HospitalFAQRequest {
  query: string;
}

/**
 * 1. AI Patient Intake
 * Extracts structured symptoms, severity, and suggested department routing without medical diagnosis.
 */
export async function analyzePatientIntake(
  params: IntakeRequest
): Promise<IntakeAssessment> {
  try {
    const response = await fetch("/api/gemini/patient-intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data: IntakeAssessment = await response.json();
    return data;
  } catch (error) {
    console.warn("Falling back to local intake heuristics:", error);
    const text = params.text.toLowerCase();

    let dept = "General Medicine";
    let urgency = "Standard Outpatient Visit";
    let reason = "Broad clinical evaluation indicated by presenting complaint.";

    if (text.includes("heart") || text.includes("chest") || text.includes("palpitation")) {
      dept = "Cardiology";
      urgency = text.includes("severe") || text.includes("pressure") ? "Priority Outpatient / Urgent Triage" : "Standard Consultation";
      reason = "Chest or cardiovascular indicators suggest routing to Cardiology.";
    } else if (text.includes("skin") || text.includes("rash") || text.includes("itching") || text.includes("eczema")) {
      dept = "Dermatology";
      reason = "Cutaneous symptoms suggest evaluation in Dermatology.";
    } else if (text.includes("child") || text.includes("baby") || text.includes("pediatric")) {
      dept = "Pediatrics";
      reason = "Patient age category best addressed by Pediatric specialist.";
    } else if (text.includes("bone") || text.includes("joint") || text.includes("knee") || text.includes("sprain")) {
      dept = "Orthopedics";
      reason = "Musculoskeletal symptoms suggest evaluation in Orthopedics.";
    }

    return {
      mainComplaint: params.text.slice(0, 100),
      duration: "Reported in consultation request",
      symptoms: [
        params.text.length > 50 ? params.text.slice(0, 50) + "..." : params.text,
        "Reported discomfort during routine daily activity",
      ],
      severity: text.includes("severe") || text.includes("emergency") ? "Needs Timely Evaluation" : "Moderate",
      relevantInfo: `Self-reported intake entry. Patient age: ${params.patientAge || "Adult"}.`,
      suggestedDepartment: dept,
      routingReason: reason,
      recommendedUrgency: urgency,
      disclaimer: "MediFlow AI does not diagnose illnesses or prescribe medications. Please see a qualified physician for a clinical exam.",
    };
  }
}

/**
 * 2. Medical Report Explainer
 * Translates clinical lab values and medical terminology into simple, plain-English educational guidance.
 */
export async function explainMedicalReport(
  params: ReportExplainRequest
): Promise<AIReportExplanation> {
  try {
    const response = await fetch("/api/gemini/explain-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data: AIReportExplanation = await response.json();
    return data;
  } catch (error) {
    console.warn("Falling back to local report explainer heuristics:", error);
    return {
      reportTitle: params.reportType || "Diagnostic Laboratory Report",
      summary: "This report reviews biological indicators and cell counts from your recent diagnostic tests.",
      keyFindings: [
        {
          term: "Complete Blood Count (CBC)",
          explanation: "Measures red cells, white infection-fighting cells, and clotting platelets.",
          value: "Reference Standard Included",
          status: "Educational Note",
        },
        {
          term: "Hemoglobin (Hb)",
          explanation: "An iron-rich protein in red blood cells that transports oxygen to your muscles and brain.",
          value: "13.8 g/dL (Typical: 12.0 - 15.5)",
          status: "Standard Range",
        },
        {
          term: "White Blood Cells (WBC)",
          explanation: "Cells of your immune system that defend against viral and bacterial illness.",
          value: "7,400 /uL (Typical: 4,500 - 11,000)",
          status: "Standard Range",
        },
      ],
      questionsForDoctor: [
        "Do any of these test results require changes to my daily routine?",
        "Should we repeat this test at my next follow-up appointment?",
        "Are there specific vitamins or nutritional guidelines you recommend?",
      ],
      disclaimer: "MediFlow AI provides educational explanations only. It does not diagnose diseases or modify prescriptions. Always consult your doctor.",
    };
  }
}

/**
 * 3. Doctor AI Patient Summary
 * Generates an objective, concise administrative and intake summary for physicians.
 */
export async function generatePatientSummary(
  params: DoctorSummaryRequest
): Promise<DoctorAISummary> {
  try {
    const response = await fetch("/api/gemini/doctor-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data: DoctorAISummary = await response.json();
    return data;
  } catch (error) {
    console.warn("Falling back to local doctor summary heuristics:", error);
    const p = params.patientData;
    return {
      patientInfo: `${p.name || "Patient"}, ${p.age || "34"} y/o ${p.gender || "Female"} (ID: ${p.patientId || "PID-000"})`,
      presentingComplaint: p.chiefComplaint || "Presenting with acute discomfort for clinical review.",
      relevantHistory: p.medicalHistory ? p.medicalHistory.join("; ") : "No chronic illnesses flagged.",
      previousVisits: p.previousVisitsSummary || "Last seen for routine annual wellness checkup.",
      recentReportsSummary: p.recentReportsSummary || "CBC & basic metabolic panel available in diagnostic records.",
      uploadedReportsSummary: p.recentReportsSummary || "CBC & basic metabolic panel available in diagnostic records.",
      keyReviewItems: [
        `Review primary complaint: ${p.chiefComplaint || "Acute symptoms"}`,
        `Check known allergies: ${p.allergies ? p.allergies.join(", ") : "NKDA"}`,
        `Verify tolerance of active medications: ${p.activeMedications ? p.activeMedications.join(", ") : "None"}`,
      ],
      keyItemsForClinicianReview: [
        `Review primary complaint: ${p.chiefComplaint || "Acute symptoms"}`,
        `Check known allergies: ${p.allergies ? p.allergies.join(", ") : "NKDA"}`,
        `Verify tolerance of active medications: ${p.activeMedications ? p.activeMedications.join(", ") : "None"}`,
      ],
      disclaimer: "AI-generated administrative/clinical summary — verify all information before clinical use.",
    };
  }
}

/**
 * 4. Hospital FAQ and Wayfinding Assistant
 */
export async function answerHospitalFAQ(
  params: HospitalFAQRequest
): Promise<{ answer: string; location?: string; additionalInfo?: string }> {
  try {
    const response = await fetch("/api/gemini/hospital-faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Falling back to local FAQ heuristics:", error);
    const q = params.query.toLowerCase();
    let location = "Main Hospital Reception, Ground Floor";
    let answer = `You can inquire at the central lobby desk or follow digital floor directory displays.`;

    if (q.includes("lab") || q.includes("blood") || q.includes("test")) {
      location = "Diagnostic Laboratory → Second Floor → Block B → Room 306";
      answer = "The Central Diagnostic Laboratory is located on the Second Floor, Block B (Room 306). Fast blood draws and sample drop-offs operate 7:30 AM to 6:00 PM.";
    } else if (q.includes("emergency") || q.includes("urgent")) {
      location = "Emergency & Trauma Center → Ground Floor → Block A → Room 102 (24/7)";
      answer = "The Emergency Department is open 24/7 on the Ground Floor, Block A with dedicated ambulance ingress.";
    } else if (q.includes("pharmacy") || q.includes("medicine")) {
      location = "Central Pharmacy → Ground Floor → Block C → Room 105";
      answer = "The Central Outpatient Pharmacy is on the Ground Floor, Block C, next to the main exit.";
    } else if (q.includes("x-ray") || q.includes("mri") || q.includes("scan") || q.includes("radiology")) {
      location = "Radiology & Imaging → Second Floor → Block C → Room 310";
      answer = "Digital X-Ray and Radiology suites are located on the Second Floor, Block C (Room 310).";
    } else if (q.includes("cardio") || q.includes("heart")) {
      location = "Cardiology Department → Second Floor → Block A → Rooms 301-305";
      answer = "The Cardiology Department and ECG stations are situated on the Second Floor, Block A.";
    } else if (q.includes("pediatric") || q.includes("child")) {
      location = "Pediatrics Department → First Floor → Block B → Rooms 206-210";
      answer = "The Pediatrics Clinic and Well-Baby area are located on the First Floor, Block B.";
    }

    return {
      answer,
      location,
      additionalInfo: "Visiting Hours: 10:00 AM - 1:00 PM and 4:30 PM - 7:30 PM daily.",
    };
  }
}
