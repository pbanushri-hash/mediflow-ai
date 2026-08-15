import React, { useState } from "react";
import {
  Users,
  Stethoscope,
  Building2,
  Calendar,
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
  X,
  MapPin,
  Clock,
  Star,
  Activity,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { Doctor, Department, Appointment, HospitalRoom, Patient } from "../../types";
import { StatusBadge } from "../../components/common/StatusBadge";
import { SearchBar } from "../../components/common/SearchBar";
import { Modal } from "../../components/common/Modal";

export const AdminManagement: React.FC = () => {
  const {
    doctors,
    departments,
    appointments,
    rooms,
    patients,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    cancelAppointment,
    addRoom,
    updateRoom,
    deleteRoom,
  } = useHospital();

  const [activeTab, setActiveTab] = useState<"doctors" | "departments" | "appointments" | "rooms" | "patients">("doctors");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<HospitalRoom | null>(null);

  // Doctor Form State
  const [docName, setDocName] = useState("");
  const [docDeptId, setDocDeptId] = useState(departments[0]?.id || "");
  const [docSpecialization, setDocSpecialization] = useState("");
  const [docRoomNumber, setDocRoomNumber] = useState("");
  const [docExp, setDocExp] = useState("8");
  const [docStatus, setDocStatus] = useState<"Available" | "In Consultation" | "On Break">("Available");

  // Dept Form State
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [deptFloor, setDeptFloor] = useState("Ground Floor");
  const [deptDesc, setDeptDesc] = useState("");
  const [deptHead, setDeptHead] = useState("");

  // Room Form State
  const [roomNum, setRoomNum] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState<any>("OPD Consultation");
  const [roomFloor, setRoomFloor] = useState("Ground Floor");
  const [roomBlock, setRoomBlock] = useState("A");
  const [roomDirections, setRoomDirections] = useState("");

  // Doctor Actions
  const handleOpenAddDoctor = () => {
    setEditingDoctor(null);
    setDocName("");
    setDocDeptId(departments[0]?.id || "");
    setDocSpecialization("");
    setDocRoomNumber("Room 105");
    setDocExp("8");
    setDocStatus("Available");
    setIsDoctorModalOpen(true);
  };

  const handleOpenEditDoctor = (doc: Doctor) => {
    setEditingDoctor(doc);
    setDocName(doc.name);
    setDocDeptId(doc.departmentId);
    setDocSpecialization(doc.specialization);
    setDocRoomNumber(doc.roomNumber);
    setDocExp(String(doc.experienceYears));
    setDocStatus(doc.status as any);
    setIsDoctorModalOpen(true);
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find((d) => d.id === docDeptId);
    if (!dept) return;

    if (editingDoctor) {
      updateDoctor(editingDoctor.id, {
        name: docName,
        departmentId: dept.id,
        departmentName: dept.name,
        specialization: docSpecialization,
        roomNumber: docRoomNumber,
        experienceYears: Number(docExp),
        status: docStatus,
      });
    } else {
      addDoctor({
        name: docName,
        title: "Senior Consultant",
        departmentId: dept.id,
        departmentName: dept.name,
        specialization: docSpecialization,
        roomNumber: docRoomNumber,
        availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        rating: 4.8,
        experienceYears: Number(docExp),
        status: docStatus,
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
        consultationSlots: ["09:30 AM", "10:30 AM", "02:00 PM", "03:30 PM"],
      });
    }
    setIsDoctorModalOpen(false);
  };

  // Department Actions
  const handleOpenAddDept = () => {
    setEditingDept(null);
    setDeptName("");
    setDeptCode("");
    setDeptFloor("Ground Floor");
    setDeptDesc("");
    setDeptHead("");
    setIsDeptModalOpen(true);
  };

  const handleOpenEditDept = (dept: Department) => {
    setEditingDept(dept);
    setDeptName(dept.name);
    setDeptCode(dept.code);
    setDeptFloor(dept.floor);
    setDeptDesc(dept.description);
    setDeptHead(dept.headOfDepartment);
    setIsDeptModalOpen(true);
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDept) {
      updateDepartment(editingDept.id, {
        name: deptName,
        code: deptCode,
        floor: deptFloor,
        description: deptDesc,
        headOfDepartment: deptHead,
      });
    } else {
      addDepartment({
        name: deptName,
        code: deptCode.toUpperCase(),
        floor: deptFloor,
        description: deptDesc,
        headOfDepartment: deptHead,
        activeDoctorsCount: 1,
        totalQueueToday: 0,
        rooms: ["Chamber 1"],
      });
    }
    setIsDeptModalOpen(false);
  };

  // Room Actions
  const handleOpenAddRoom = () => {
    setEditingRoom(null);
    setRoomNum("");
    setRoomName("");
    setRoomType("OPD Consultation");
    setRoomFloor("Ground Floor");
    setRoomBlock("A");
    setRoomDirections("");
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      updateRoom(editingRoom.id, {
        roomNumber: roomNum,
        name: roomName,
        type: roomType,
        floor: roomFloor,
        block: roomBlock,
        directions: roomDirections,
      });
    } else {
      addRoom({
        roomNumber: roomNum,
        name: roomName,
        departmentId: departments[0]?.id || "dept-1",
        departmentName: departments[0]?.name || "General Medicine",
        type: roomType,
        floor: roomFloor,
        block: roomBlock,
        status: "Available",
        capacity: "1 Patient + 1 Attendant",
        directions: roomDirections,
      });
    }
    setIsRoomModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-700/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-indigo-100 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospital Administration Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hospital Resource Management
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1">
            CRUD management for doctors, clinical departments, appointments, and facilities.
          </p>
        </div>

        {/* Dynamic Add Button */}
        {activeTab === "doctors" && (
          <button
            type="button"
            onClick={handleOpenAddDoctor}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-indigo-900 hover:bg-indigo-50 shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Doctor</span>
          </button>
        )}
        {activeTab === "departments" && (
          <button
            type="button"
            onClick={handleOpenAddDept}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-indigo-900 hover:bg-indigo-50 shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        )}
        {activeTab === "rooms" && (
          <button
            type="button"
            onClick={handleOpenAddRoom}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-indigo-900 hover:bg-indigo-50 shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hospital Room</span>
          </button>
        )}
      </div>

      {/* Tabs Navigation & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl w-full sm:w-auto overflow-x-auto">
          {[
            { key: "doctors", label: "Doctors", icon: Stethoscope, count: doctors.length },
            { key: "departments", label: "Departments", icon: Building2, count: departments.length },
            { key: "appointments", label: "Appointments", icon: Calendar, count: appointments.length },
            { key: "patients", label: "Patients", icon: Users, count: patients.length },
            { key: "rooms", label: "Rooms & Labs", icon: Layers, count: rooms.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key as any);
                  setSearchQuery("");
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200/70 text-slate-700">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={`Search in ${activeTab}...`}
          className="w-full sm:w-64"
        />
      </div>

      {/* Tab 1: Doctors Management */}
      {activeTab === "doctors" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Doctor</th>
                  <th className="py-3.5 px-4">Department & Room</th>
                  <th className="py-3.5 px-4">Specialization</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors
                  .filter(
                    (d) =>
                      !searchQuery ||
                      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      d.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      d.specialization.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={doc.avatar}
                            alt={doc.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{doc.name}</div>
                            <div className="text-[10px] text-slate-400">{doc.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{doc.departmentName}</div>
                        <div className="text-[11px] text-slate-500">{doc.roomNumber}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {doc.specialization}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {doc.experienceYears} Years
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={doc.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditDoctor(doc)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                            title="Edit Doctor"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteDoctor(doc.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Doctor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Departments Management */}
      {activeTab === "departments" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments
              .filter(
                (d) =>
                  !searchQuery ||
                  d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  d.code.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((dept) => (
                <div
                  key={dept.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-extrabold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                        {dept.code}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditDept(dept)}
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteDepartment(dept.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 mt-2">{dept.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{dept.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Head:</span>
                      <span className="font-semibold text-slate-800">{dept.headOfDepartment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span>{dept.floor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Active Doctors:</span>
                      <span className="font-bold text-indigo-700">{dept.activeDoctorsCount}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 3: Appointments */}
      {activeTab === "appointments" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Token & ID</th>
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Doctor & Department</th>
                  <th className="py-3.5 px-4">Date & Slot</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments
                  .filter(
                    (a) =>
                      !searchQuery ||
                      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      a.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-xs border border-sky-200">
                          {apt.tokenNumber}
                        </span>
                        <div className="font-mono text-[10px] text-slate-400 mt-0.5">{apt.id}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{apt.patientName}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{apt.doctorName}</div>
                        <div className="text-[11px] text-slate-500">{apt.departmentName}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {apt.date} • <span className="font-semibold text-slate-800">{apt.timeSlot}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={apt.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {apt.status !== "Cancelled" && (
                          <button
                            type="button"
                            onClick={() => cancelAppointment(apt.id)}
                            className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded hover:bg-rose-50"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Patients */}
      {activeTab === "patients" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Patient ID & Name</th>
                  <th className="py-3.5 px-4">Age / Gender</th>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4">Chief Complaint</th>
                  <th className="py-3.5 px-4">Token & Time</th>
                  <th className="py-3.5 px-4">Queue Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients
                  .filter(
                    (p) =>
                      !searchQuery ||
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">{p.patientId}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {p.age} yrs • {p.gender}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{p.bloodGroup}</td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">{p.chiefComplaint}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-sky-700">{p.tokenNumber}</span>
                        <div className="text-[10px] text-slate-400">{p.appointmentTime}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={p.queueStatus} size="sm" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Hospital Rooms */}
      {activeTab === "rooms" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms
              .filter(
                (r) =>
                  !searchQuery ||
                  r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  r.floor.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((room) => (
                <div
                  key={room.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-extrabold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded">
                        {room.roomNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteRoom(room.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 mt-2">{room.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{room.departmentName}</p>
                    <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">{room.directions}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                    <span>{room.floor} (Block {room.block})</span>
                    <StatusBadge status={room.status} size="sm" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Doctor */}
      <Modal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        title={editingDoctor ? "Edit Specialist Details" : "Register New Doctor"}
        subtitle="Manage physician profile, department assignment, and room number"
      >
        <form onSubmit={handleSaveDoctor} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Full Name</label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Dr. Full Name, MD"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
              <select
                value={docDeptId}
                onChange={(e) => setDocDeptId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Room Chamber</label>
              <input
                type="text"
                value={docRoomNumber}
                onChange={(e) => setDocRoomNumber(e.target.value)}
                placeholder="Room 102"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                value={docExp}
                onChange={(e) => setDocExp(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duty Status</label>
              <select
                value={docStatus}
                onChange={(e) => setDocStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              >
                <option value="Available">Available</option>
                <option value="In Consultation">In Consultation</option>
                <option value="On Break">On Break</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Specialization & Bio</label>
            <input
              type="text"
              value={docSpecialization}
              onChange={(e) => setDocSpecialization(e.target.value)}
              placeholder="e.g. Preventive Care, Adult Medicine & Hypertension"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsDoctorModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              Save Doctor
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add/Edit Department */}
      <Modal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        title={editingDept ? "Edit Department" : "Add Clinical Department"}
        subtitle="Configure hospital specialty department and floor assignment"
      >
        <form onSubmit={handleSaveDept} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department Name</label>
              <input
                type="text"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                placeholder="Cardiology"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department Code</label>
              <input
                type="text"
                value={deptCode}
                onChange={(e) => setDeptCode(e.target.value)}
                placeholder="CARD"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Floor Location</label>
              <select
                value={deptFloor}
                onChange={(e) => setDeptFloor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              >
                <option value="Ground Floor">Ground Floor</option>
                <option value="First Floor">First Floor</option>
                <option value="Second Floor">Second Floor</option>
                <option value="Third Floor">Third Floor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Head of Department</label>
              <input
                type="text"
                value={deptHead}
                onChange={(e) => setDeptHead(e.target.value)}
                placeholder="Dr. Specialist, MD"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={deptDesc}
              onChange={(e) => setDeptDesc(e.target.value)}
              placeholder="Clinical focus and service summary..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsDeptModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              Save Department
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add/Edit Room */}
      <Modal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        title="Add Hospital Facility / Room"
        subtitle="Wayfinding directory entry"
      >
        <form onSubmit={handleSaveRoom} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Room / Chamber Number</label>
              <input
                type="text"
                value={roomNum}
                onChange={(e) => setRoomNum(e.target.value)}
                placeholder="Room 106"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Facility Name</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Electrocardiogram (ECG) Lab"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Floor</label>
              <select
                value={roomFloor}
                onChange={(e) => setRoomFloor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              >
                <option value="Ground Floor">Ground Floor</option>
                <option value="First Floor">First Floor</option>
                <option value="Second Floor">Second Floor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Block</label>
              <select
                value={roomBlock}
                onChange={(e) => setRoomBlock(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              >
                <option value="A">Block A</option>
                <option value="B">Block B</option>
                <option value="C">Block C</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              >
                <option value="OPD Consultation">OPD Consultation</option>
                <option value="Diagnostic Lab">Diagnostic Lab</option>
                <option value="Treatment Room">Treatment Room</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Wayfinding Directions</label>
            <textarea
              rows={2}
              value={roomDirections}
              onChange={(e) => setRoomDirections(e.target.value)}
              placeholder="e.g. Take West elevator to 1st Floor, follow signs to Block A, second door on left."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRoomModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              Save Room
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
