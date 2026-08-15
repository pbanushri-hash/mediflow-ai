import React from "react";
import { IntakeAssessment, AIReportExplanation, DoctorAISummary } from "../../types";
import {
  Sparkles,
  CheckCircle2,
  Building2,
  AlertCircle,
  HelpCircle,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

interface AIIntakeCardProps {
  data: IntakeAssessment;
  onBookDepartment?: (dept: string) => void;
}

export const AIIntakeResponseCard: React.FC<AIIntakeCardProps> = ({
  data,
  onBookDepartment,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-200/90 shadow-md relative overflow-hidden animate-in fade-in slide-in-from-bottom-2">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-400/10 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 leading-tight">
              AI Intake & Department Routing
            </h3>
            <p className="text-xs text-slate-500">Structured Triage Extraction</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Non-Diagnostic Triage</span>
        </span>
      </div>

      {/* Structured Extracted Content */}
      <div className="mt-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Chief Complaint
            </div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">
              {data.mainComplaint}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Duration & Urgency
            </div>
            <div className="text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{data.duration || "Reported in consultation"}</span>
              <span className="text-xs font-normal text-slate-500">({data.recommendedUrgency})</span>
            </div>
          </div>
        </div>

        {/* Symptoms List */}
        <div>
          <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Symptoms Extracted for Doctor:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.symptoms.map((sym, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-medium bg-teal-50/70 text-teal-800 rounded-lg border border-teal-100"
              >
                {sym}
              </span>
            ))}
          </div>
        </div>

        {/* Suggested Department Routing */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50/80 via-teal-50/80 to-blue-50/80 border border-sky-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-600 text-white shrink-0 shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-sky-800">
                  Recommended Hospital Department
                </div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {data.suggestedDepartment}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  {data.routingReason}
                </p>
              </div>
            </div>

            <Link
              to={`/patient/appointments?dept=${encodeURIComponent(data.suggestedDepartment)}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all shrink-0"
            >
              <span>Book in {data.suggestedDepartment}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-[11px] text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            {data.disclaimer ||
              "MediFlow AI does NOT provide medical diagnosis or treatment plans. A certified doctor should evaluate your symptoms."}
          </span>
        </div>
      </div>
    </div>
  );
};

export const AIReportExplanationCard: React.FC<{ data: AIReportExplanation }> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-md space-y-5 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 leading-tight">
              {data.reportTitle}
            </h3>
            <p className="text-xs text-slate-500">Plain-Language Medical Translation</p>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
          Educational Guide
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
        <strong className="text-slate-900 block mb-1">Summary Overview:</strong>
        {data.summary}
      </div>

      {/* Key Terms Table */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Medical Terms Explained Simply
        </h4>
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
          {data.keyFindings.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-white hover:bg-slate-50/70 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="font-bold text-xs text-slate-900">{item.term}</div>
                <div className="text-[11px] font-mono font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded inline-block w-fit">
                  {item.value}
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-1">{item.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Questions for Doctor */}
      {data.questionsForDoctor && data.questionsForDoctor.length > 0 && (
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100">
          <div className="text-xs font-bold text-teal-900 mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-teal-600" />
            <span>Questions to Ask Your Doctor at Consultation:</span>
          </div>
          <ul className="space-y-1.5 text-xs text-teal-950">
            {data.questionsForDoctor.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>{data.disclaimer}</span>
      </div>
    </div>
  );
};
