import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Activity,
  Bell,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Building2,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { UserRole } from "../../types";

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { currentUser, role, switchUser, notifications, markNotificationRead } = useHospital();
  const navigate = useNavigate();
  const location = useLocation();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isLandingPage = location.pathname === "/";

  const handleRoleChange = (newRole: UserRole) => {
    switchUser(newRole);
    setShowRoleDropdown(false);
    if (newRole === "patient") navigate("/patient/dashboard");
    else if (newRole === "doctor") navigate("/doctor/dashboard");
    else if (newRole === "admin") navigate("/admin/dashboard");
  };

  const getRoleLabel = () => {
    switch (role) {
      case "patient":
        return "Patient Portal";
      case "doctor":
        return "Physician Portal";
      case "admin":
        return "Hospital Administration";
    }
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case "patient":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "doctor":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "admin":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand & Mobile Menu */}
          <div className="flex items-center gap-3">
            {!isLandingPage && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  MediFlow <span className="text-sky-600 text-sm font-semibold px-1.5 py-0.5 rounded-md bg-sky-50 border border-sky-200">AI</span>
                </span>
                <span className="hidden sm:block text-[11px] text-slate-500 font-medium">
                  Hospital Care & Flow Engine
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Live AI Badge & Portal Mode */}
          {!isLandingPage && (
            <div className="hidden md:flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getRoleBadgeColor()}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{getRoleLabel()}</span>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md flex items-center gap-1 transition-colors"
                >
                  <span>Switch Role</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showRoleDropdown && (
                  <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch Role Mode
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRoleChange("patient")}
                      className={`w-full text-left px-3.5 py-2 text-sm flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${role === "patient" ? "text-teal-700 font-semibold bg-teal-50/60" : "text-slate-700"}`}
                    >
                      <UserIcon className="w-4 h-4 text-teal-600" />
                      <div>
                        <div>Patient View</div>
                        <div className="text-[11px] text-slate-500 font-normal">Sarah Jenkins (PID-8492)</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleChange("doctor")}
                      className={`w-full text-left px-3.5 py-2 text-sm flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${role === "doctor" ? "text-blue-700 font-semibold bg-blue-50/60" : "text-slate-700"}`}
                    >
                      <Stethoscope className="w-4 h-4 text-blue-600" />
                      <div>
                        <div>Doctor View</div>
                        <div className="text-[11px] text-slate-500 font-normal">Dr. Arun Mehta (Gen Med)</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleChange("admin")}
                      className={`w-full text-left px-3.5 py-2 text-sm flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${role === "admin" ? "text-indigo-700 font-semibold bg-indigo-50/60" : "text-slate-700"}`}
                    >
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div>Admin View</div>
                        <div className="text-[11px] text-slate-500 font-normal">Hospital Operations</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right: Notifications, Quick Actions, Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {isLandingPage ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/patient/intake"
                  className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm shadow-sky-600/20 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start AI Intake</span>
                </Link>
              </div>
            ) : (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifDropdown && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                        <div className="font-semibold text-sm text-slate-800">Hospital Notifications</div>
                        <span className="text-xs text-sky-600 font-medium">{unreadCount} unread</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? "bg-sky-50/40" : ""}`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span
                                className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                                  n.type === "queue"
                                    ? "bg-amber-500"
                                    : n.type === "success"
                                    ? "bg-emerald-500"
                                    : "bg-sky-500"
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-slate-900">{n.title}</div>
                                <div className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</div>
                                <div className="text-[10px] text-slate-400 mt-1">{n.timestamp}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src={currentUser.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/20"
                    />
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-semibold text-slate-800 leading-tight line-clamp-1">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase font-medium">{role}</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="font-semibold text-sm text-slate-900">{currentUser.name}</div>
                        <div className="text-xs text-slate-500">{currentUser.email}</div>
                        {currentUser.patientId && (
                          <div className="mt-1 inline-flex items-center text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            Patient ID: {currentUser.patientId}
                          </div>
                        )}
                        {currentUser.doctorId && (
                          <div className="mt-1 inline-flex items-center text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                            Doctor ID: {currentUser.doctorId}
                          </div>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          to="/login"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <ShieldCheck className="w-4 h-4 text-slate-400" />
                          <span>Change User / Role</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate("/login");
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
