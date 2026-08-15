export type UserRole = "patient" | "doctor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  patientId?: string;
  doctorId?: string;
}

export interface Patient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  contactNumber: string;
  email: string;
  emergencyContact: string;
  chiefComplaint: string;
  queueStatus: "Waiting" | "In Consultation" | "Completed" | "No Show";
  appointmentTime: string;
  assignedDoctorId: string;
  departmentId: string;
  tokenNumber: string;
  medicalHistory: string[];
  allergies: string[];
  activeMedications: string[];
  previousVisitsSummary: string;
  recentReportsSummary: string;
  doctorNotes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  specialization: string;
  roomNumber: string;
  experienceYears: number;
  availableDays: string[];
  consultationSlots: string[];
  rating: number;
  activePatientsCount: number;
  avatar: string;
  status: "Available" | "In Consultation" | "On Break" | "Off Duty";
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headDoctor?: string;
  headOfDepartment?: string;
  floor: string;
  block?: string;
  roomRange?: string;
  activeDoctorsCount?: number;
  waitingQueueCount?: number;
  totalQueueToday?: number;
  rooms?: string[];
  iconName?: string;
  description: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  date: string;
  timeSlot: string;
  reasonForVisit: string;
  tokenNumber: string;
  status: "Confirmed" | "Waiting" | "In Progress" | "In Consultation" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface QueueToken {
  tokenNumber: string;
  departmentCode: string;
  departmentName: string;
  patientId: string;
  patientName: string;
  assignedDoctorId: string;
  doctorName: string;
  roomNumber: string;
  issuedAt: string;
  estimatedWaitMinutes: number;
  positionInQueue: number;
  currentlyServingToken: string;
  status: "Waiting" | "Called" | "In Service" | "Completed";
}

export interface MedicalReport {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  testType: string;
  date: string;
  doctorName: string;
  facility: string;
  summary: string;
  fileUrl?: string;
  rawText?: string;
  findings?: Array<{
    term: string;
    explanation: string;
    value: string;
    status: string;
  }>;
}

export interface HospitalRoom {
  id: string;
  roomNumber: string;
  name?: string;
  floor: "Ground Floor" | "First Floor" | "Second Floor" | "Third Floor" | string;
  block: "Block A" | "Block B" | "Block C" | "Lobby Wing" | "A" | "B" | "C" | string;
  department?: string;
  departmentId?: string;
  departmentName?: string;
  purpose?: string;
  type?: string;
  status: "Available" | "Occupied" | "Maintenance" | "Sanitizing" | string;
  capacity?: string;
  directions?: string;
  description?: string;
  assignedStaff?: string;
}

export interface IntakeAssessment {
  mainComplaint: string;
  duration: string;
  symptoms: string[];
  severity: "Mild" | "Moderate" | "Needs Timely Evaluation" | string;
  relevantInfo: string;
  suggestedDepartment: string;
  routingReason: string;
  recommendedUrgency: string;
  disclaimer: string;
}

export interface AIReportExplanation {
  reportTitle: string;
  summary: string;
  keyFindings: Array<{
    term: string;
    explanation: string;
    value: string;
    status: string;
  }>;
  questionsForDoctor: string[];
  disclaimer: string;
}

export interface DoctorAISummary {
  patientInfo?: string;
  presentingComplaint: string;
  relevantHistory: string;
  previousVisits: string;
  recentReportsSummary?: string;
  uploadedReportsSummary?: string;
  keyReviewItems?: string[];
  keyItemsForClinicianReview?: string[];
  disclaimer: string;
}

export interface HospitalNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "warning" | "success" | "queue";
  read: boolean;
}
