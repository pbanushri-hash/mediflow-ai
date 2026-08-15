import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Ticket,
  FileText,
  Sparkles,
  Compass,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Stethoscope,
  Activity,
  History,
  Phone,
  Building2,
  ChevronRight,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { DashboardCard } from "../../components/common/DashboardCard";
import { TokenCard } from "../../components/cards/TokenCard";
import { AppointmentCard } from "../../components/cards/AppointmentCard";
import { DisclaimerBanner } from "../../components/common/DisclaimerBanner";
import { Modal } from "../../components/common/Modal";

export const PatientDashboard: React.FC = () => {
  const { currentUser, appointments, queueToken, medicalReports, patients } = useHospital();
  const navigate = useNavigate();

  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const patientRecord = patients.find((p) => p.patientId === currentUser.patientId) || patients[0];
  const upcomingAppointments = appointments.filter(
    (a) => (a.patientId === currentUser.patientId || a.patientName === currentUser.name) && a.status !== "Cancelled"
  );
  const nextAppointment = upcomingAppointments[0];
  const completedVisitsCount = appointments.filter((a) => a.status === "Completed").length;

  const quickActions = [
    {
      title: "AI Patient Intake",
      desc: "Report symptoms for department routing",
      icon: Sparkles,
      link: "/patient/intake",
      color: "bg-teal-50 text-teal-600 border-teal-200 hover:border-teal-400",
      highlight: true,
    },
    {
      title: "Book Appointment",
      desc: "Choose doctors, departments and time slots",
      icon: Calendar,
      link: "/patient/appointments",
      color: "bg-sky-50 text-sky-600 border-sky-200 hover:border-sky-400",
    },
    {
      title: "My Token & Queue",
      desc: "Track live queue status & wait time",
      icon: Ticket,
      link: "/patient/queue",
      color: "bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-400",
    },
    {
      title: "Explain Medical Report",
      desc: "Plain English translation of lab values",
      icon: FileText,
      link: "/patient/reports",
      color: "bg-indigo-50 text-indigo-600 border-indigo-200 hover:border-indigo-400",
    },
    {
      title: "Find Department",
      desc: "Hospital floor plans and room directory",
      icon: Compass,
      link: "/patient/navigation",
      color: "bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-400",
    },
    {
      title: "Medical History",
      desc: "Past diagnoses, allergies & medications",
      icon: History,
      onClick: () => setShowHistoryModal(true),
      color: "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Patient Welcome Header */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-sky-600/15 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-sky-100 mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Patient Health Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 mt-1 flex items-center gap-3">
              <span>Patient ID: <strong>{currentUser.patientId || "PID-8492"}</strong></span>
              <span>•</span>
              <span>Blood Group: <strong>{patientRecord?.bloodGroup || "O+"}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/patient/intake"
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-sky-800 hover:bg-sky-50 shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Start AI Intake</span>
            </Link>
            <Link
              to="/patient/appointments"
              className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-sky-800/60 hover:bg-sky-800 text-white border border-sky-400/40 transition-all"
            >
              Book Visit
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <DashboardCard
          title="Upcoming Appointment"
          value={nextAppointment ? nextAppointment.timeSlot : "None Today"}
          subtitle={nextAppointment ? `${nextAppointment.doctorName} (${nextAppointment.departmentName})` : "Schedule your next visit"}
          icon={Calendar}
          iconColor="bg-sky-50 text-sky-600"
          onClick={() => navigate("/patient/appointments")}
        />

        <DashboardCard
          title="Current Token"
          value={queueToken.tokenNumber}
          subtitle={`Serving: ${queueToken.currentlyServingToken} (~${queueToken.estimatedWaitMinutes}m wait)`}
          icon={Ticket}
          iconColor="bg-teal-50 text-teal-600"
          onClick={() => navigate("/patient/queue")}
        />

        <DashboardCard
          title="Diagnostic Reports"
          value={medicalReports.length}
          subtitle="CBC & Metabolic tests on file"
          icon={FileText}
          iconColor="bg-indigo-50 text-indigo-600"
          onClick={() => navigate("/patient/reports")}
        />

        <DashboardCard
          title="Completed Visits"
          value={completedVisitsCount}
          subtitle="Past consultations logged"
          icon={CheckCircle2}
          iconColor="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Main Grid: Live Queue & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Token Card (Left 2 cols or 1 col on mobile) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Token Component */}
          <TokenCard token={queueToken} onRefresh={() => {}} />

          {/* Quick Actions Grid */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Quick Patient Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                const content = (
                  <div
                    className={`p-4 rounded-2xl border transition-all h-full flex flex-col justify-between ${action.color}`}
                  >
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-white/80 shadow-xs flex items-center justify-center mb-2.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-sm text-slate-900 leading-tight">
                        {action.title}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {action.desc}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center text-xs font-semibold">
                      <span>Open</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </div>
                  </div>
                );

                if (action.link) {
                  return (
                    <Link key={idx} to={action.link} className="block">
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={action.onClick}
                    className="block text-left w-full"
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Upcoming Appointments & Recent Reports */}
        <div className="space-y-6">
          {/* Upcoming Appointment Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900">Upcoming Visit</h3>
              <Link
                to="/patient/appointments"
                className="text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                View all ({upcomingAppointments.length})
              </Link>
            </div>

            {upcomingAppointments.length > 0 ? (
              <AppointmentCard
                appointment={upcomingAppointments[0]}
                compact
                onViewToken={() => navigate("/patient/queue")}
              />
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                No active appointments scheduled.
              </div>
            )}
          </div>

          {/* Recent Reports List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900">Recent Lab Reports</h3>
              <Link
                to="/patient/reports"
                className="text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                Explain with AI
              </Link>
            </div>

            <div className="space-y-2.5">
              {medicalReports.slice(0, 2).map((rep) => (
                <Link
                  key={rep.id}
                  to={`/patient/reports?id=${rep.id}`}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-sky-50/70 border border-slate-100 hover:border-sky-200 transition-all flex items-start gap-3 group block"
                >
                  <div className="p-2 rounded-xl bg-white text-sky-600 shadow-xs shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate group-hover:text-sky-700">
                      {rep.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {rep.date} • {rep.doctorName}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 transition-colors shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Medical History Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title={`Medical Record Summary — ${currentUser.name}`}
        subtitle={`Patient ID: ${currentUser.patientId || "PID-8492"} • Blood Group: ${patientRecord?.bloodGroup || "O+"}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-bold text-slate-800 mb-1">Medical Background:</div>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {patientRecord?.medicalHistory.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <div className="font-bold mb-1">Documented Allergies:</div>
            <div>{patientRecord?.allergies.join(", ") || "No known allergies"}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900">
            <div className="font-bold mb-1">Active Medications:</div>
            <div>{patientRecord?.activeMedications.join(", ") || "None recorded"}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
            <div className="font-bold text-slate-800 mb-1">Previous Visit Summary:</div>
            <div>{patientRecord?.previousVisitsSummary}</div>
          </div>
        </div>
      </Modal>

      {/* Medical Disclaimer */}
      <DisclaimerBanner compact />
    </div>
  );
};
