import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HospitalProvider, useHospital } from "./context/HospitalContext";
import { Navbar } from "./components/common/Navbar";
import { Sidebar } from "./components/common/Sidebar";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";

// Patient Module
import { PatientDashboard } from "./pages/patient/PatientDashboard";
import { AIPatientIntake } from "./pages/patient/AIPatientIntake";
import { AppointmentBooking } from "./pages/patient/AppointmentBooking";
import { QueueSystem } from "./pages/patient/QueueSystem";
import { ReportExplainer } from "./pages/patient/ReportExplainer";
import { HospitalNavigation } from "./pages/patient/HospitalNavigation";

// Doctor Module
import { DoctorDashboard } from "./pages/doctor/DoctorDashboard";
import { DoctorPatientQueue } from "./pages/doctor/DoctorPatientQueue";
import { DoctorPatientDetail } from "./pages/doctor/DoctorPatientDetail";

// Admin Module
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminManagement } from "./pages/admin/AdminManagement";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isPublicPage = location.pathname === "/" || location.pathname === "/login";

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Responsive Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Routed Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <HospitalProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Patient Module */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/intake" element={<AIPatientIntake />} />
            <Route path="/patient/appointments" element={<AppointmentBooking />} />
            <Route path="/patient/queue" element={<QueueSystem />} />
            <Route path="/patient/reports" element={<ReportExplainer />} />
            <Route path="/patient/navigation" element={<HospitalNavigation />} />

            {/* Doctor Module */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<DoctorPatientQueue />} />
            <Route path="/doctor/patients/:id" element={<DoctorPatientDetail />} />

            {/* Admin Module */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/management" element={<AdminManagement />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </HospitalProvider>
  );
};

export default App;
