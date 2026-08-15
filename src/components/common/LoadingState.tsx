import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  isAi?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Processing request...",
  subMessage = "Please wait a moment while we coordinate with hospital systems.",
  isAi = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white/70 border border-slate-200/80">
      <div className="relative mb-4">
        {isAi ? (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
      </div>

      <h3 className="text-base font-bold text-slate-800">{message}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
        {subMessage}
      </p>
    </div>
  );
};
