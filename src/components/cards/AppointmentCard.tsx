import React from "react";
import { Appointment } from "../../types";
import { StatusBadge } from "../common/StatusBadge";
import { Calendar, Clock, User, Stethoscope, Ticket, XCircle } from "lucide-react";

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onViewToken?: (token: string) => void;
  compact?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  onViewToken,
  compact = false,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 leading-tight">
              {appointment.doctorName}
            </h4>
            <p className="text-xs text-slate-500">{appointment.departmentName}</p>
          </div>
        </div>

        <StatusBadge status={appointment.status} size="sm" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{appointment.date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{appointment.timeSlot}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <Ticket className="w-3.5 h-3.5 text-sky-500" />
          <span className="font-mono font-bold text-sky-700">Token: {appointment.tokenNumber}</span>
        </div>
      </div>

      {appointment.reasonForVisit && !compact && (
        <div className="mt-3 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Reason: </span>
          <span>{appointment.reasonForVisit}</span>
        </div>
      )}

      {!compact && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-mono text-[11px] text-slate-400">ID: {appointment.id}</span>
          <div className="flex items-center gap-2">
            {onViewToken && (
              <button
                type="button"
                onClick={() => onViewToken(appointment.tokenNumber)}
                className="font-medium text-sky-600 hover:text-sky-700 px-2.5 py-1 rounded-md hover:bg-sky-50 transition-colors"
              >
                Track Live Token
              </button>
            )}
            {onCancel && appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
              <button
                type="button"
                onClick={() => onCancel(appointment.id)}
                className="font-medium text-rose-600 hover:text-rose-700 px-2 py-1 rounded-md hover:bg-rose-50 transition-colors flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
