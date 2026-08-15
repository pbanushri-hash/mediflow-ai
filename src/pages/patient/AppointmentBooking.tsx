import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  CheckCircle2,
  Ticket,
  ArrowRight,
  Sparkles,
  Filter,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { DoctorCard } from "../../components/cards/DoctorCard";
import { AppointmentCard } from "../../components/cards/AppointmentCard";
import { Doctor, Appointment } from "../../types";
import { Modal } from "../../components/common/Modal";

export const AppointmentBooking: React.FC = () => {
  const { departments, doctors, appointments, bookAppointment, cancelAppointment, currentUser } = useHospital();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const deptParam = searchParams.get("dept");

  const [selectedDeptId, setSelectedDeptId] = useState<string>(() => {
    if (deptParam) {
      const match = departments.find(
        (d) => d.name.toLowerCase() === deptParam.toLowerCase() || d.code.toLowerCase() === deptParam.toLowerCase()
      );
      if (match) return match.id;
    }
    return departments[0]?.id || "dept-gen-med";
  });

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("Today, Aug 15");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("10:30 AM");
  const [reasonForVisit, setReasonForVisit] = useState<string>("General health checkup and symptom review");
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const availableDoctors = doctors.filter((doc) => doc.departmentId === selectedDeptId);
  const selectedDept = departments.find((d) => d.id === selectedDeptId);
  const selectedDoc = doctors.find((d) => d.id === selectedDoctorId) || availableDoctors[0];

  useEffect(() => {
    if (availableDoctors.length > 0 && !availableDoctors.some((d) => d.id === selectedDoctorId)) {
      setSelectedDoctorId(availableDoctors[0].id);
      if (availableDoctors[0].consultationSlots?.[0]) {
        setSelectedTimeSlot(availableDoctors[0].consultationSlots[0]);
      }
    }
  }, [selectedDeptId, availableDoctors]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !selectedDept) return;

    const apt = bookAppointment({
      patientId: currentUser.patientId || "PID-8492",
      patientName: currentUser.name,
      doctorId: selectedDoc.id,
      doctorName: selectedDoc.name,
      departmentId: selectedDept.id,
      departmentName: selectedDept.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      reasonForVisit: reasonForVisit || "Routine consultation",
    });

    setConfirmedAppointment(apt);
  };

  const myAppointments = appointments.filter(
    (a) => a.patientId === currentUser.patientId || a.patientName === currentUser.name
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-sky-600/15">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-sky-100 w-fit mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>Outpatient Consultation Scheduler</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Book Hospital Appointment
        </h1>
        <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-2xl leading-relaxed">
          Choose a clinical department, select a consultant doctor, and pick an available consultation time slot. A live queue token will be generated immediately.
        </p>
      </div>

      {/* Main Grid: Form on Left, Available Doctors on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Booking Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-sky-600" />
            <span>Select Consultation Details</span>
          </h2>

          <form onSubmit={handleBookingSubmit} className="space-y-5">
            {/* Department Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hospital Department
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {departments.map((dept) => {
                  const isSelected = dept.id === selectedDeptId;
                  return (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => setSelectedDeptId(dept.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "bg-sky-50 border-sky-600 text-sky-900 shadow-xs"
                          : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="font-bold text-xs truncate">{dept.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{dept.floor}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Doctor Selection Dropdown/Radio */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Attending Specialist / Doctor
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableDoctors.map((doc) => {
                  const isSelected = doc.id === selectedDoctorId;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        isSelected
                          ? "bg-sky-50 border-sky-600 text-sky-900 shadow-xs ring-1 ring-sky-600"
                          : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate text-slate-900">{doc.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{doc.title}</div>
                        <div className="text-[10px] text-sky-700 font-semibold mt-1">
                          {doc.roomNumber}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Consultation Date
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  <option value="Today, Aug 15">Today, Aug 15 (Immediate Outpatient)</option>
                  <option value="Tomorrow, Aug 16">Tomorrow, Aug 16</option>
                  <option value="Monday, Aug 18">Monday, Aug 18</option>
                  <option value="Next Week, Aug 22">Next Week, Aug 22</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Time Slot
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  {selectedDoc?.consultationSlots?.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot} (Available)
                    </option>
                  )) || <option value="10:30 AM">10:30 AM</option>}
                </select>
              </div>
            </div>

            {/* Reason for Visit */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Reason for Consultation
              </label>
              <textarea
                rows={3}
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
                placeholder="Briefly state symptoms or follow-up reason..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Appointment & Generate Token</span>
            </button>
          </form>
        </div>

        {/* Right 5 Cols: Selected Doctor Summary & Live Directory */}
        <div className="lg:col-span-5 space-y-6">
          {selectedDoc && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Selected Specialist Details
              </h3>
              <DoctorCard
                doctor={selectedDoc}
                selectedSlot={selectedTimeSlot}
                onSelectSlot={(slot) => setSelectedTimeSlot(slot)}
              />
            </div>
          )}

          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-teal-950 text-xs space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-teal-900">
              <Ticket className="w-4 h-4 text-teal-600" />
              <span>Automatic Token Issuance</span>
            </div>
            <p className="text-teal-800 leading-relaxed">
              When your appointment is confirmed, MediFlow AI automatically books your slot in the department queue and assigns a digital token for live waiting room tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmedAppointment && (
        <Modal
          isOpen={Boolean(confirmedAppointment)}
          onClose={() => setConfirmedAppointment(null)}
          title="Appointment Confirmed!"
          subtitle={`Appointment ID: ${confirmedAppointment.id}`}
        >
          <div className="space-y-5 text-center sm:text-left">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-sm text-emerald-900">
                  Your appointment is successfully scheduled.
                </div>
                <div className="text-emerald-700 mt-0.5">
                  A live digital token has been registered under your profile.
                </div>
              </div>
            </div>

            {/* Structured Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-800">{confirmedAppointment.doctorName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Department:</span>
                <span className="font-bold text-slate-800">{confirmedAppointment.departmentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Scheduled Time:</span>
                <span className="font-bold text-slate-800">
                  {confirmedAppointment.date} at {confirmedAppointment.timeSlot}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Issued Token:</span>
                <span className="font-mono font-extrabold text-sky-700 text-sm">
                  {confirmedAppointment.tokenNumber}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmedAppointment(null)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmedAppointment(null);
                  navigate("/patient/queue");
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl text-white bg-sky-600 hover:bg-sky-700 shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Track Live Token in Queue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* List of Patient's Scheduled Appointments */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">My Appointments</h3>
            <p className="text-xs text-slate-500">Upcoming consultations and history</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700">
            {myAppointments.length} Total Bookings
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myAppointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onCancel={(id) => cancelAppointment(id)}
              onViewToken={() => navigate("/patient/queue")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
