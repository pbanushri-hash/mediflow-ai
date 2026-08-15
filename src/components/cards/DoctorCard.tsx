import React from "react";
import { Doctor } from "../../types";
import { StatusBadge } from "../common/StatusBadge";
import { Star, MapPin, Calendar, Clock, Award } from "lucide-react";

interface DoctorCardProps {
  doctor: Doctor;
  onBook?: (doc: Doctor) => void;
  selectedSlot?: string;
  onSelectSlot?: (slot: string) => void;
  compact?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onBook,
  selectedSlot,
  onSelectSlot,
  compact = false,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-3.5">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-sm text-slate-900 truncate">{doctor.name}</h4>
              <StatusBadge status={doctor.status} size="sm" />
            </div>
            <p className="text-xs text-sky-700 font-medium">{doctor.departmentName}</p>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{doctor.specialization}</p>

            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {doctor.rating}
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                {doctor.experienceYears} yrs exp
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{doctor.roomNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{doctor.availableDays.join(", ")}</span>
          </div>
        </div>

        {/* Available Consultation Slots */}
        {doctor.consultationSlots && doctor.consultationSlots.length > 0 && !compact && (
          <div className="mt-3.5">
            <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Available Slots Today</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {doctor.consultationSlots.slice(0, 4).map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectSlot?.(slot)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    selectedSlot === slot
                      ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {onBook && (
        <button
          type="button"
          onClick={() => onBook(doctor)}
          className="mt-4 w-full py-2 px-3 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Select Doctor</span>
        </button>
      )}
    </div>
  );
};
