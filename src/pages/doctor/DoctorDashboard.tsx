import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  CheckCircle2,
  Stethoscope,
  Activity,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Eye,
  FileText,
  AlertCircle,
  Play,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { DashboardCard } from "../../components/common/DashboardCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { SearchBar } from "../../components/common/SearchBar";
import { DisclaimerBanner } from "../../components/common/DisclaimerBanner";
import { Patient } from "../../types";

export const DoctorDashboard: React.FC = () => {
  const { patients, currentUser, updatePatientStatus, queueToken, advanceQueue } = useHospital();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const todayPatients = patients;
  const waitingPatients = patients.filter((p) => p.queueStatus === "Waiting");
  const inConsultPatients = patients.filter((p) => p.queueStatus === "In Consultation");
  const completedPatients = patients.filter((p) => p.queueStatus === "Completed");

  const filteredPatients = patients.filter((p) => {
    const matchesFilter = statusFilter === "All" || p.queueStatus === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.patientId.toLowerCase().includes(q) ||
      p.chiefComplaint.toLowerCase().includes(q) ||
      p.tokenNumber.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  const handleStartConsultation = (patient: Patient) => {
    updatePatientStatus(patient.id, "In Consultation");
    navigate(`/doctor/patients/${patient.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-blue-600/15 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-blue-100 mb-2">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Physician Clinical Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dr. Arun Mehta, MD
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 flex items-center gap-3">
              <span>Department of General Medicine</span>
              <span>•</span>
              <span>Consultation Chamber: <strong>Room 102 (1st Floor)</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={advanceQueue}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-blue-800 hover:bg-blue-50 shadow-md transition-all flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-blue-700 text-blue-700" />
              <span>Call Next Token</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <DashboardCard
          title="Today's Patients"
          value={todayPatients.length}
          subtitle="Total scheduled consultations"
          icon={Users}
          iconColor="bg-blue-50 text-blue-600"
        />

        <DashboardCard
          title="Waiting in Queue"
          value={waitingPatients.length}
          subtitle="Patients in waiting lounge"
          icon={Clock}
          iconColor="bg-amber-50 text-amber-600"
        />

        <DashboardCard
          title="In Consultation"
          value={inConsultPatients.length}
          subtitle="Currently in Room 102"
          icon={Activity}
          iconColor="bg-sky-50 text-sky-600"
        />

        <DashboardCard
          title="Completed Today"
          value={completedPatients.length}
          subtitle="Discharged & prescriptions logged"
          icon={CheckCircle2}
          iconColor="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Patient Queue Management Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        {/* Table Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Today's Patient Queue</h3>
            <p className="text-xs text-slate-500">
              Live consultation roster with pre-consult AI summaries
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search patient, ID, complaint..."
              className="w-full sm:w-64"
            />

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
              {["All", "Waiting", "In Consultation", "Completed"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === status
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Token & Patient</th>
                <th className="py-3.5 px-4">Age / Gender</th>
                <th className="py-3.5 px-4">Slot Time</th>
                <th className="py-3.5 px-4">Chief Complaint</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-extrabold text-sky-700 bg-sky-50 px-2 py-1 rounded-md border border-sky-200 text-xs">
                        {patient.tokenNumber}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{patient.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {patient.patientId}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {patient.age} yrs • {patient.gender}
                    <div className="text-[10px] text-slate-400">Blood: {patient.bloodGroup}</div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {patient.appointmentTime}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">
                    <span className="line-clamp-1">{patient.chiefComplaint}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={patient.queueStatus} size="sm" />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/doctor/patients/${patient.id}`}
                        className="px-2.5 py-1.5 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 font-semibold transition-colors flex items-center gap-1"
                        title="View AI Clinical Summary"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>AI Chart</span>
                      </Link>

                      {patient.queueStatus !== "Completed" && (
                        <button
                          type="button"
                          onClick={() => handleStartConsultation(patient)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs flex items-center gap-1"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>
                            {patient.queueStatus === "In Consultation"
                              ? "Resume"
                              : "Start Consult"}
                          </span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Notice */}
      <DisclaimerBanner />
    </div>
  );
};
