import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Send,
  Building2,
  AlertCircle,
  HelpCircle,
  Stethoscope,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { analyzePatientIntake } from "../../services/geminiService";
import { IntakeAssessment } from "../../types";
import { AIIntakeResponseCard } from "../../components/cards/AIResponseCard";
import { LoadingState } from "../../components/common/LoadingState";
import { DisclaimerBanner } from "../../components/common/DisclaimerBanner";
import { ErrorMessage } from "../../components/common/ErrorMessage";

export const AIPatientIntake: React.FC = () => {
  const { currentUser } = useHospital();
  const navigate = useNavigate();

  const [symptomText, setSymptomText] = useState("");
  const [patientAge, setPatientAge] = useState<string>("34");
  const [patientGender, setPatientGender] = useState<string>("Female");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IntakeAssessment | null>(null);

  const sampleComplaints = [
    "I have been having dull stomach pain and mild nausea since yesterday after lunch.",
    "Dry itchy red skin rash appearing on both forearms after using a new detergent.",
    "Mild shortness of breath when walking up stairs and feeling tired for 3 days.",
    "My 6-year-old daughter has a clear runny nose, mild throat irritation, and low warmth.",
    "Right knee stiffness and discomfort after playing soccer 2 days ago.",
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!symptomText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const assessment = await analyzePatientIntake({
        text: symptomText,
        patientAge,
        patientGender,
      });
      setResult(assessment);
    } catch (err: any) {
      setError(err.message || "Failed to analyze intake complaint.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSymptomText("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-teal-600/15">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-teal-100 w-fit mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Hospital Intake & Department Routing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          AI Patient Symptom Intake
        </h1>
        <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-2xl leading-relaxed">
          Describe your health concern in your own words. MediFlow AI extracts structured intake notes and suggests the appropriate hospital department for clinical consultation.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-900">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-snug">
          <strong>Non-Diagnostic System:</strong> MediFlow AI routes you to the correct department and assists clinical intake. It does <strong>NOT</strong> diagnose medical diseases or prescribe treatments.
        </div>
      </div>

      {/* Main Intake Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Demographics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Patient Age
              </label>
              <input
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                min="1"
                max="120"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Gender
              </label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other / Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Symptom Input Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800">
                Describe What You Are Experiencing
              </label>
              <span className="text-[11px] text-slate-400">
                Include onset, location, duration & severity
              </span>
            </div>
            <textarea
              rows={4}
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              placeholder="e.g., I have been having stomach pain since yesterday after eating dinner..."
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all leading-relaxed"
            />
          </div>

          {/* Sample Chips */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Click a sample symptom scenario to test:
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleComplaints.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSymptomText(sample)}
                  className="text-xs text-left px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 border border-slate-200 text-slate-700 transition-all"
                >
                  "{sample.slice(0, 45)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 flex items-center justify-between gap-3">
            {result ? (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Intake</span>
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={isLoading || !symptomText.trim()}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <span>Extracting Intake Notes...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Symptoms & Suggest Department</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <LoadingState
          isAi
          message="MediFlow AI is structuring intake data..."
          subMessage="Extracting chief complaints, symptoms, and routing department safely."
        />
      )}

      {/* Error Message */}
      {error && <ErrorMessage message={error} onRetry={() => handleSubmit()} />}

      {/* AI Extraction Result Card */}
      {result && !isLoading && (
        <AIIntakeResponseCard
          data={result}
          onBookDepartment={(dept) => {
            navigate(`/patient/appointments?dept=${encodeURIComponent(dept)}`);
          }}
        />
      )}

      {/* Full Disclaimer Banner */}
      <DisclaimerBanner />
    </div>
  );
};
