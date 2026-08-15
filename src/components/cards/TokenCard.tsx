import React from "react";
import { QueueToken } from "../../types";
import { StatusBadge } from "../common/StatusBadge";
import { Ticket, Clock, Users, MapPin, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

interface TokenCardProps {
  token: QueueToken;
  onRefresh?: () => void;
  onAdvance?: () => void;
  isDoctorView?: boolean;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  token,
  onRefresh,
  onAdvance,
  isDoctorView = false,
}) => {
  const isCurrentlyServing = token.tokenNumber === token.currentlyServingToken;
  const isCalled = token.status === "Called" || token.positionInQueue === 0;

  return (
    <div className="bg-gradient-to-br from-white via-sky-50/20 to-teal-50/30 rounded-3xl p-6 sm:p-7 border border-sky-200/80 shadow-md relative overflow-hidden">
      {/* Accent Background Glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-sky-600 text-white shadow-md shadow-sky-600/20">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 leading-tight">Live Queue Token</h3>
            <p className="text-xs text-slate-500">{token.departmentName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={token.status} size="md" />
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/80 transition-colors border border-slate-200/70"
              title="Refresh queue status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Token Numbers Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        {/* Patient's Token */}
        <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Your Token Number
          </span>
          <div className="mt-1 text-3xl sm:text-4xl font-extrabold font-mono text-sky-700 tracking-tight">
            {token.tokenNumber}
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Issued at {token.issuedAt}</span>
          </div>
        </div>

        {/* Currently Serving Token */}
        <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-xs text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Currently Serving
          </span>
          <div className="mt-1 text-3xl sm:text-4xl font-extrabold font-mono text-teal-600 tracking-tight flex items-center justify-center gap-2">
            <span>{token.currentlyServingToken}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-teal-700 font-semibold">
            <Users className="w-3.5 h-3.5 text-teal-600" />
            <span>
              {token.positionInQueue === 0
                ? "You're up next!"
                : `${token.positionInQueue} patients ahead`}
            </span>
          </div>
        </div>
      </div>

      {/* Wait Time Indicator */}
      <div className="mt-4 p-4 rounded-2xl bg-white/90 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800">
              Estimated Waiting Time: ~{token.estimatedWaitMinutes} minutes
            </div>
            <div className="text-slate-500 text-[11px]">
              Assigned: {token.doctorName} • {token.roomNumber}
            </div>
          </div>
        </div>

        {isCalled ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Proceed to {token.roomNumber}</span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-500 italic">
            Please remain in the waiting lounge.
          </div>
        )}
      </div>

      {/* Doctor Action Controls */}
      {isDoctorView && onAdvance && (
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onAdvance}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>Call Next Token</span>
          </button>
        </div>
      )}
    </div>
  );
};
