import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Activity,
  Users,
  Stethoscope,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { UserRole } from "../types";

export const LoginPage: React.FC = () => {
  const { switchUser, doctors } = useHospital();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = (searchParams.get("role") as UserRole) || "patient";
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "patient") {
      setEmail("sarah.jenkins@example.com");
      setPassword("patient123");
    } else if (role === "doctor") {
      setEmail("arun.mehta@hospital.mediflow.org");
      setPassword("doctor123");
    } else if (role === "admin") {
      setEmail("admin.vance@mediflow.org");
      setPassword("admin123");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication with quick timeout (Firebase Auth compatible)
    setTimeout(() => {
      setIsLoading(false);
      switchUser(selectedRole);
      if (selectedRole === "patient") navigate("/patient/dashboard");
      else if (selectedRole === "doctor") navigate("/doctor/dashboard");
      else if (selectedRole === "admin") navigate("/admin/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white shadow-lg shadow-sky-600/20 mb-3">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            MediFlow AI Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Intelligent Hospital Care & Flow Management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
          {/* Role Selection Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select User Role
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/80 rounded-2xl">
              <button
                type="button"
                onClick={() => handleRoleSelect("patient")}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  selectedRole === "patient"
                    ? "bg-white text-teal-700 shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Patient</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("doctor")}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  selectedRole === "doctor"
                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("admin")}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  selectedRole === "admin"
                    ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Quick Mock User Info Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-sky-900">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>
                {selectedRole === "patient"
                  ? "Signing in as Patient: Sarah Jenkins (PID-8492)"
                  : selectedRole === "doctor"
                  ? "Signing in as Clinician: Dr. Arun Mehta (doc-1)"
                  : "Signing in as Administrator: David Vance"}
              </span>
            </div>
            <p className="text-[11px] text-sky-700 mt-1">
              Ready for production Firebase Authentication. Click Sign In below to enter.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hospital / Personal Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === "patient"
                      ? "patient@example.com"
                      : selectedRole === "doctor"
                      ? "doctor@hospital.org"
                      : "admin@hospital.org"
                  }
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <span>Remember session</span>
              </label>
              <span className="text-sky-600 hover:text-sky-700 font-medium cursor-pointer">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-70 shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Enter {selectedRole.toUpperCase()} Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          MediFlow AI Hospital Management • HIPAA-Compliant Architecture
        </div>
      </div>
    </div>
  );
};
