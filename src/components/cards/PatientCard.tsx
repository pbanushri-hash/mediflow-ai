import React from "react";
import { Patient } from "../../types";
import { StatusBadge } from "../common/StatusBadge";
import { User, Clock, FileText, Activity, AlertTriangle, ChevronRight, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

interface PatientCardProps {
  patient: Patient;
  onSelect?: (patient: Patient) => void;
  onStartConsultation?: (patient: Patient) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onSelect,
  onStartConsultation,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-100 to-teal-100 text-sky-800 flex items-center justify-center font-bold text-sm shrink-0 border border-sky-200">
            {patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-900 leading-tight">{patient.name}</h4>
              <span className="font-mono text-[11px] font-semibold text-slate-500 px-1.5 py-0.5 rounded bg-slate-100">
                {patient.patientId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {patient.age} yrs • {patient.gender} • Blood Group: <span className="font-semibold text-slate-700">{patient.bloodGroup}</span>
            </p>
          </div>
        </div>

        <StatusBadge status={patient.queueStatus} size="sm" />
      </div>

      <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
        <div className="text-slate-500 font-medium">Chief Complaint:</div>
        <div className="text-slate-800 font-semibold mt-0.5 line-clamp-2">
          {patient.chiefComplaint}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Slot: <strong className="text-slate-800">{patient.appointmentTime}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-sky-500" />
          <span>Token: <strong className="font-mono text-sky-700">{patient.tokenNumber}</strong></span>
        </div>
      </div>

      {patient.allergies && patient.allergies.length > 0 && patient.allergies[0] !== "No known drug allergies (NKDA)" && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="truncate">Allergies: {patient.allergies.join(", ")}</span>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/doctor/patients/${patient.id}`}
          className="text-xs font-semibold text-slate-700 hover:text-sky-600 flex items-center gap-1 transition-colors"
        >
          <span>View Patient Chart & AI Summary</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        {onStartConsultation && patient.queueStatus !== "Completed" && (
          <button
            type="button"
            onClick={() => onStartConsultation(patient)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>{patient.queueStatus === "In Consultation" ? "Resume" : "Start Consult"}</span>
          </button>
        )}
      </div>
    </div>
  );
};
