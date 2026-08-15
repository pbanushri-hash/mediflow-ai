import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  User,
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Clock,
  Pill,
  History,
  ShieldCheck,
  Send,
  Printer,
  ChevronRight,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { generatePatientSummary } from "../../services/geminiService";
import { DoctorAISummary } from "../../types";
import { LoadingState } from "../../components/common/LoadingState";
import { DisclaimerBanner } from "../../components/common/DisclaimerBanner";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Modal } from "../../components/common/Modal";

export const DoctorPatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, updatePatientStatus, medicalReports } = useHospital();

  const patient = patients.find((p) => p.id === id) || patients[0];

  const [aiSummary, setAiSummary] = useState<DoctorAISummary | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(true);
  const [clinicalNotes, setClinicalNotes] = useState<string>(
    "Patient examined in OPD. Abdomen soft, non-tender to light palpation. Advised lifestyle changes, hydration, and light meals."
  );
  const [prescriptions, setPrescriptions] = useState<string>(
    "1. Antacid Suspension - 10ml thrice daily after meals (5 days)\n2. Probiotic capsule - once daily (7 days)"
  );
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSummary = async () => {
      if (!patient) return;
      setIsLoadingAi(true);
      try {
        const summary = await generatePatientSummary({
          patientData: {
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            bloodGroup: patient.bloodGroup,
            chiefComplaint: patient.chiefComplaint,
            medicalHistory: patient.medicalHistory,
            allergies: patient.allergies,
            activeMedications: patient.activeMedications,
            previousVisitsSummary: patient.previousVisitsSummary,
            recentReports: medicalReports.map((r) => `${r.title} (${r.date})`),
          },
        });
        if (isMounted) setAiSummary(summary);
      } catch (e) {
        console.error("Failed to generate AI summary", e);
      } finally {
        if (isMounted) setIsLoadingAi(false);
      }
    };

    fetchSummary();
    return () => {
      isMounted = false;
    };
  }, [patient]);

  if (!patient) {
    return (
      <div className="p-8 text-center text-slate-500">
        Patient record not found. <Link to="/doctor/dashboard" className="text-blue-600 underline">Return to dashboard</Link>
      </div>
    );
  }

  const handleFinishConsultation = () => {
    updatePatientStatus(patient.id, "Completed");
    setIsCompletedModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/doctor/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patient Queue</span>
        </Link>

        <div className="flex items-center gap-2">
          <StatusBadge status={patient.queueStatus} size="md" />
        </div>
      </div>

      {/* Patient Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20 shrink-0">
            {patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{patient.name}</h2>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {patient.patientId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
              <span>{patient.age} yrs</span>
              <span>•</span>
              <span>{patient.gender}</span>
              <span>•</span>
              <span>Blood Group: <strong className="text-slate-700">{patient.bloodGroup}</strong></span>
              <span>•</span>
              <span>Token: <strong className="font-mono text-sky-700">{patient.tokenNumber}</strong></span>
            </p>
          </div>
        </div>

        {patient.queueStatus !== "Completed" && (
          <button
            type="button"
            onClick={handleFinishConsultation}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Consultation</span>
          </button>
        )}
      </div>

      {/* AI Pre-Consult Clinical Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200/90 shadow-md relative overflow-hidden space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                AI Pre-Consult Clinical Summary
              </h3>
              <p className="text-xs text-slate-500">
                Synthesized from intake reports, historical records, and lab results
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clinician Review Required</span>
          </span>
        </div>

        {isLoadingAi ? (
          <LoadingState
            isAi
            message="Synthesizing patient chart with Gemini AI..."
            subMessage="Aggregating symptoms, medical background, medication interactions, and diagnostic findings."
          />
        ) : aiSummary ? (
          <div className="space-y-5 text-xs">
            {/* Demographics & Presenting Complaint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Presenting Complaint & Timeline
                </div>
                <div className="text-sm font-bold text-slate-900 leading-snug">
                  {aiSummary.presentingComplaint}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Documented Medical History
                </div>
                <div className="text-slate-800 font-medium leading-snug">
                  {aiSummary.relevantHistory}
                </div>
              </div>
            </div>

            {/* Key Clinical Flags & Review Items */}
            {aiSummary.keyReviewItems && aiSummary.keyReviewItems.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                <div className="font-bold text-amber-900 mb-2 flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Key Items Requiring Physician Attention:</span>
                </div>
                <ul className="space-y-1.5 text-amber-950">
                  {aiSummary.keyReviewItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Diagnostic Highlights & Previous Visits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Recent Diagnostic Findings</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {aiSummary.recentReportsSummary}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  <span>Previous Consultation Summary</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {aiSummary.previousVisits}
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600">
              {aiSummary.disclaimer}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500">Summary unavailable.</div>
        )}
      </div>

      {/* Doctor's Active Consultation Record & Rx */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-blue-600" />
          <span>Doctor Consultation Notes & Orders</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Clinical Assessment & Examination Notes
            </label>
            <textarea
              rows={3}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Prescriptions & Diagnostic Orders
            </label>
            <textarea
              rows={3}
              value={prescriptions}
              onChange={(e) => setPrescriptions(e.target.value)}
              className="w-full p-3.5 font-mono bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Assigned Attending: Dr. Arun Mehta, MD
            </span>

            <button
              type="button"
              onClick={handleFinishConsultation}
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Record & Mark Completed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Completion Confirmation Modal */}
      <Modal
        isOpen={isCompletedModalOpen}
        onClose={() => {
          setIsCompletedModalOpen(false);
          navigate("/doctor/dashboard");
        }}
        title="Consultation Completed Successfully"
        subtitle={`Patient ${patient.name} (${patient.patientId}) has been discharged.`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-sm text-emerald-900">
                Consultation notes and digital prescriptions recorded.
              </div>
              <div className="text-emerald-700 mt-0.5">
                The next patient in queue has been alerted to proceed to Room 102.
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                setIsCompletedModalOpen(false);
                navigate("/doctor/dashboard");
              }}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              Return to Doctor Queue
            </button>
          </div>
        </div>
      </Modal>

      {/* Regulatory Banner */}
      <DisclaimerBanner />
    </div>
  );
};
