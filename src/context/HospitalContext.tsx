import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  UserRole,
  Patient,
  Doctor,
  Department,
  Appointment,
  QueueToken,
  MedicalReport,
  HospitalRoom,
  HospitalNotification,
} from "../types";
import {
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_QUEUE_STATE,
  INITIAL_MEDICAL_REPORTS,
  INITIAL_ROOMS,
  INITIAL_NOTIFICATIONS,
} from "../data/mockData";

interface HospitalContextType {
  currentUser: User;
  role: UserRole;
  setRole: (role: UserRole) => void;
  switchUser: (role: UserRole, id?: string) => void;
  departments: Department[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  queueToken: QueueToken;
  medicalReports: MedicalReport[];
  rooms: HospitalRoom[];
  notifications: HospitalNotification[];
  // Actions
  bookAppointment: (data: Omit<Appointment, "id" | "tokenNumber" | "createdAt" | "status">) => Appointment;
  cancelAppointment: (id: string) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  advanceQueue: () => void;
  refreshQueue: () => void;
  claimTokenForDepartment: (deptCode: string, reason?: string) => QueueToken;
  // Patient CRUD
  addPatient: (patient: Omit<Patient, "id">) => Patient;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addDoctorNote: (patientId: string, note: string) => void;
  // Doctor CRUD
  addDoctor: (doctor: Omit<Doctor, "id">) => Doctor;
  updateDoctor: (id: string, data: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  // Department CRUD
  addDepartment: (dept: Omit<Department, "id">) => Department;
  updateDepartment: (id: string, data: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  // Room CRUD
  addRoom: (room: Omit<HospitalRoom, "id">) => HospitalRoom;
  updateRoom: (id: string, data: Partial<HospitalRoom>) => void;
  deleteRoom: (id: string) => void;
  // Reports
  addMedicalReport: (report: Omit<MedicalReport, "id">) => MedicalReport;
  markNotificationRead: (id: string) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user & role
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem("mediflow_role") as UserRole) || "patient";
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return {
      id: "usr-pat-1",
      name: "Sarah Jenkins",
      email: "sarah.jenkins@example.com",
      role: "patient",
      patientId: "PID-8492",
      phone: "+1 (555) 234-5678",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    };
  });

  // State data collections
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [queueToken, setQueueToken] = useState<QueueToken>(INITIAL_QUEUE_STATE);
  const [medicalReports, setMedicalReports] = useState<MedicalReport[]>(INITIAL_MEDICAL_REPORTS);
  const [rooms, setRooms] = useState<HospitalRoom[]>(INITIAL_ROOMS);
  const [notifications, setNotifications] = useState<HospitalNotification[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    localStorage.setItem("mediflow_role", role);
  }, [role]);

  const switchUser = (newRole: UserRole, id?: string) => {
    setRoleState(newRole);
    if (newRole === "patient") {
      setCurrentUser({
        id: "usr-pat-1",
        name: "Sarah Jenkins",
        email: "sarah.jenkins@example.com",
        role: "patient",
        patientId: "PID-8492",
        phone: "+1 (555) 234-5678",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      });
    } else if (newRole === "doctor") {
      const doc = doctors.find((d) => d.id === (id || "doc-1")) || doctors[0];
      setCurrentUser({
        id: doc.id,
        name: doc.name,
        email: "arun.mehta@hospital.mediflow.org",
        role: "doctor",
        doctorId: doc.id,
        phone: "+1 (555) 800-4321",
        avatar: doc.avatar,
      });
    } else if (newRole === "admin") {
      setCurrentUser({
        id: "usr-admin-1",
        name: "Director David Vance",
        email: "admin.vance@mediflow.org",
        role: "admin",
        phone: "+1 (555) 900-1122",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      });
    }
  };

  const setRole = (newRole: UserRole) => {
    switchUser(newRole);
  };

  // Appointment Booking
  const bookAppointment = (data: Omit<Appointment, "id" | "tokenNumber" | "createdAt" | "status">): Appointment => {
    const dept = departments.find((d) => d.id === data.departmentId);
    const code = dept ? dept.code : "GEN";
    const randomTokenNum = Math.floor(10 + Math.random() * 89);
    const tokenNumber = `${code}-${randomTokenNum}`;

    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now().toString().slice(-4)}`,
      tokenNumber,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newApt, ...prev]);

    // Update queue token if current patient booked it
    if (data.patientId === currentUser.patientId) {
      setQueueToken({
        tokenNumber,
        departmentCode: code,
        departmentName: data.departmentName,
        patientId: data.patientId,
        patientName: data.patientName,
        assignedDoctorId: data.doctorId,
        doctorName: data.doctorName,
        roomNumber: "Room 201 (1st Floor)",
        issuedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        estimatedWaitMinutes: 20,
        positionInQueue: 4,
        currentlyServingToken: `${code}-012`,
        status: "Waiting",
      });
    }

    // Add notification
    const newNotif: HospitalNotification = {
      id: `notif-${Date.now()}`,
      title: `Appointment Confirmed with ${data.doctorName}`,
      message: `Your booking for ${data.date} at ${data.timeSlot} (${data.departmentName}) is confirmed. Token: ${tokenNumber}`,
      timestamp: "Just now",
      type: "success",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newApt;
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "Cancelled" } : apt))
    );
  };

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  // Queue Operations
  const advanceQueue = () => {
    setQueueToken((prev) => {
      const match = prev.currentlyServingToken.match(/([A-Z]+)-(\d+)/);
      let nextNum = 19;
      let prefix = prev.departmentCode;
      if (match) {
        prefix = match[1];
        nextNum = parseInt(match[2], 10) + 1;
      }
      const newServing = `${prefix}-${nextNum.toString().padStart(3, "0").slice(-3)}`;
      const newPos = Math.max(0, prev.positionInQueue - 1);
      const newWait = Math.max(0, prev.estimatedWaitMinutes - 5);

      return {
        ...prev,
        currentlyServingToken: newServing,
        positionInQueue: newPos,
        estimatedWaitMinutes: newWait,
        status: newPos === 0 ? "Called" : "Waiting",
      };
    });
  };

  const refreshQueue = () => {
    setQueueToken((prev) => ({
      ...prev,
      estimatedWaitMinutes: Math.max(5, prev.estimatedWaitMinutes - 2),
    }));
  };

  const claimTokenForDepartment = (deptCode: string, reason?: string): QueueToken => {
    const dept = departments.find((d) => d.code === deptCode) || departments[0];
    const tokenNum = `${deptCode}-${Math.floor(20 + Math.random() * 70)}`;
    const newToken: QueueToken = {
      tokenNumber: tokenNum,
      departmentCode: deptCode,
      departmentName: dept.name,
      patientId: currentUser.patientId || "PID-8492",
      patientName: currentUser.name,
      assignedDoctorId: doctors.find((d) => d.departmentId === dept.id)?.id || "doc-1",
      doctorName: doctors.find((d) => d.departmentId === dept.id)?.name || "Attending Physician",
      roomNumber: `${dept.floor}, ${dept.block}`,
      issuedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      estimatedWaitMinutes: 20 + Math.floor(Math.random() * 15),
      positionInQueue: 4 + Math.floor(Math.random() * 3),
      currentlyServingToken: `${deptCode}-012`,
      status: "Waiting",
    };
    setQueueToken(newToken);
    return newToken;
  };

  // Patient CRUD
  const addPatient = (patient: Omit<Patient, "id">): Patient => {
    const newPat: Patient = {
      ...patient,
      id: `pat-${Date.now().toString().slice(-4)}`,
    };
    setPatients((prev) => [newPat, ...prev]);
    return newPat;
  };

  const updatePatient = (id: string, data: Partial<Patient>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const addDoctorNote = (patientId: string, note: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId || p.patientId === patientId
          ? {
              ...p,
              doctorNotes: p.doctorNotes ? `${p.doctorNotes}\n\n[${new Date().toLocaleTimeString()}]: ${note}` : `[${new Date().toLocaleTimeString()}]: ${note}`,
            }
          : p
      )
    );
  };

  // Doctor CRUD
  const addDoctor = (doctor: Omit<Doctor, "id">): Doctor => {
    const newDoc: Doctor = {
      ...doctor,
      id: `doc-${Date.now().toString().slice(-4)}`,
    };
    setDoctors((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const updateDoctor = (id: string, data: Partial<Doctor>) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
  };

  const deleteDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  // Department CRUD
  const addDepartment = (dept: Omit<Department, "id">): Department => {
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now().toString().slice(-4)}`,
    };
    setDepartments((prev) => [newDept, ...prev]);
    return newDept;
  };

  const updateDepartment = (id: string, data: Partial<Department>) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
  };

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  // Room CRUD
  const addRoom = (room: Omit<HospitalRoom, "id">): HospitalRoom => {
    const newRoom: HospitalRoom = {
      ...room,
      id: `room-${Date.now().toString().slice(-4)}`,
    };
    setRooms((prev) => [newRoom, ...prev]);
    return newRoom;
  };

  const updateRoom = (id: string, data: Partial<HospitalRoom>) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  const deleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  // Reports
  const addMedicalReport = (report: Omit<MedicalReport, "id">): MedicalReport => {
    const newRep: MedicalReport = {
      ...report,
      id: `rep-${Date.now().toString().slice(-4)}`,
    };
    setMedicalReports((prev) => [newRep, ...prev]);
    return newRep;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <HospitalContext.Provider
      value={{
        currentUser,
        role,
        setRole,
        switchUser,
        departments,
        doctors,
        patients,
        appointments,
        queueToken,
        medicalReports,
        rooms,
        notifications,
        bookAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        advanceQueue,
        refreshQueue,
        claimTokenForDepartment,
        addPatient,
        updatePatient,
        deletePatient,
        addDoctorNote,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addRoom,
        updateRoom,
        deleteRoom,
        addMedicalReport,
        markNotificationRead,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export function useHospital() {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
}
