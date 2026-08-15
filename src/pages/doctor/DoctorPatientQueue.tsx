import React, { useState } from "react";
import { useHospital } from "../../context/HospitalContext";
import { PatientCard } from "../../components/cards/PatientCard";
import { SearchBar } from "../../components/common/SearchBar";
import { Users, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DoctorPatientQueue: React.FC = () => {
  const { patients, updatePatientStatus } = useHospital();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredPatients = patients.filter((p) => {
    const matchStatus = filterStatus === "All" || p.queueStatus === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.patientId.toLowerCase().includes(q) ||
      p.chiefComplaint.toLowerCase().includes(q) ||
      p.tokenNumber.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-blue-600/15">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-blue-100 w-fit mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>Outpatient Roster</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Active Patient Queue
        </h1>
        <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl leading-relaxed">
          Review patient medical histories, triage notes, and AI clinical summaries before consultation.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, ID or complaint..."
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto">
          {["All", "Waiting", "In Consultation", "Completed"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterStatus === st
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onStartConsultation={(p) => {
              updatePatientStatus(p.id, "In Consultation");
              navigate(`/doctor/patients/${p.id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};
