import React, { useState } from "react";
import {
  Ticket,
  Clock,
  Users,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Bell,
  Play,
  ArrowRight,
  Building2,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { TokenCard } from "../../components/cards/TokenCard";

export const QueueSystem: React.FC = () => {
  const {
    queueToken,
    advanceQueue,
    refreshQueue,
    claimTokenForDepartment,
    departments,
  } = useHospital();

  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedWalkinDept, setSelectedWalkinDept] = useState("GM");

  const handleSimulateAdvance = () => {
    setIsSimulating(true);
    setTimeout(() => {
      advanceQueue();
      setIsSimulating(false);
    }, 300);
  };

  const handleClaimWalkin = (deptCode: string) => {
    claimTokenForDepartment(deptCode, "Walk-in registration");
  };

  const totalSteps = 6;
  const currentStep = Math.max(0, totalSteps - queueToken.positionInQueue);
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-sky-600/15">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-sky-100 w-fit mb-3">
          <Ticket className="w-3.5 h-3.5" />
          <span>Intelligent Patient Flow & Digital Queueing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Smart Token & Live Queue Tracker
        </h1>
        <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-2xl leading-relaxed">
          Monitor your position in line in real time. Avoid crowded waiting areas and receive notifications when your token is called by the consulting room.
        </p>
      </div>

      {/* Main Interactive Token Component */}
      <TokenCard token={queueToken} onRefresh={refreshQueue} />

      {/* Live Queue Visual Flow Progress Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-900">Queue Stage Progress</h3>
            <p className="text-xs text-slate-500">Live tracker for token {queueToken.tokenNumber}</p>
          </div>
          <div className="text-xs font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 w-fit">
            {progressPercent}% Journey Progress
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-teal-500 to-sky-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(10, progressPercent)}%` }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-3 rounded-2xl bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
            <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto mb-1.5 text-[11px]">
              1
            </div>
            <span>Token Issued</span>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50 text-sky-800 border border-sky-200 font-semibold">
            <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center mx-auto mb-1.5 text-[11px]">
              2
            </div>
            <span>Waiting Room</span>
          </div>

          <div
            className={`p-3 rounded-2xl border font-semibold ${
              queueToken.positionInQueue <= 1
                ? "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
                : "bg-slate-50 text-slate-500 border-slate-200"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1.5 text-[11px] ${
                queueToken.positionInQueue <= 1
                  ? "bg-amber-600 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              3
            </div>
            <span>Next in Line</span>
          </div>

          <div
            className={`p-3 rounded-2xl border font-semibold ${
              queueToken.positionInQueue === 0
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-slate-50 text-slate-500 border-slate-200"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1.5 text-[11px] ${
                queueToken.positionInQueue === 0
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              4
            </div>
            <span>Consultation</span>
          </div>
        </div>

        {/* Demo Simulation Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            <strong>Interactive Simulation:</strong> Advance the hospital queue to test dynamic updates.
          </span>
          <button
            type="button"
            onClick={handleSimulateAdvance}
            disabled={isSimulating}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2 border border-slate-200"
          >
            <Play className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
            <span>Simulate Calling Next Token</span>
          </button>
        </div>
      </div>

      {/* Walk-in Fast Token Dispenser */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 mb-1">
          Walk-in Digital Token Dispenser
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Need a token for laboratory blood draw, radiology scan, or central pharmacy without prior appointment?
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { code: "LAB", name: "Diagnostic Lab", floor: "2nd Floor" },
            { code: "PHARM", name: "Pharmacy", floor: "Ground Floor" },
            { code: "RAD", name: "Radiology & X-Ray", floor: "2nd Floor" },
            { code: "GM", name: "General Medicine", floor: "1st Floor" },
          ].map((dept) => (
            <button
              key={dept.code}
              type="button"
              onClick={() => handleClaimWalkin(dept.code)}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-left transition-all group"
            >
              <span className="font-mono text-xs font-extrabold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded">
                {dept.code}
              </span>
              <div className="font-bold text-xs text-slate-900 mt-2">{dept.name}</div>
              <div className="text-[10px] text-slate-500">{dept.floor}</div>
              <div className="mt-2 text-[11px] font-semibold text-teal-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Issue Token</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
