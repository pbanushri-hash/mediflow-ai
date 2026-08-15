import React from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";

interface DisclaimerBannerProps {
  compact?: boolean;
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  compact = false,
  className = "",
}) => {
  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 p-2.5 rounded-lg bg-amber-50/90 border border-amber-200 text-amber-900 text-xs ${className}`}
      >
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="leading-snug">
          <strong>Important:</strong> MediFlow AI provides intake routing and explanations only. It does not diagnose conditions or prescribe medications.
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-amber-50/90 via-amber-50/60 to-orange-50/90 border border-amber-200/90 shadow-xs text-amber-950 ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-amber-100/80 text-amber-700 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold text-amber-900 flex items-center gap-2">
            <span>Medical AI & Safety Disclaimer</span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-800">
              Regulatory Notice
            </span>
          </div>
          <p className="mt-1 text-xs text-amber-800 leading-relaxed">
            MediFlow AI is an administrative patient intake, queue optimization, and healthcare navigation system. It does <strong>NOT</strong> provide medical diagnoses, treatment prescriptions, or emergency clinical decisions. All AI-generated triage summaries and report explanations must be verified by a certified healthcare professional before clinical use.
          </p>
        </div>
      </div>
    </div>
  );
};
