import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  CalendarCheck,
  Ticket,
  FileText,
  Compass,
  Users,
  Building2,
  Stethoscope,
  Clock,
  PhoneCall,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: any;
  highlight?: boolean;
  badge?: string | number | undefined;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, queueToken, appointments } = useHospital();
  const location = useLocation();

  const patientLinks: NavItem[] = [
    {
      to: "/patient/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/patient/intake",
      label: "AI Patient Intake",
      icon: Sparkles,
      highlight: true,
    },
    {
      to: "/patient/appointments",
      label: "My Appointments",
      icon: CalendarCheck,
      badge: appointments.filter((a) => a.status === "Waiting" || a.status === "Confirmed").length,
    },
    {
      to: "/patient/queue",
      label: "Live Token & Queue",
      icon: Ticket,
      badge: queueToken?.positionInQueue ? `#${queueToken.positionInQueue}` : undefined,
    },
    {
      to: "/patient/reports",
      label: "Medical Report Explainer",
      icon: FileText,
    },
    {
      to: "/patient/navigation",
      label: "Hospital Navigation",
      icon: Compass,
    },
  ];

  const doctorLinks: NavItem[] = [
    {
      to: "/doctor/dashboard",
      label: "Doctor Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/doctor/patients",
      label: "Patient Queue",
      icon: Users,
      badge: "5 Active",
    },
    {
      to: "/patient/navigation",
      label: "Hospital Directory",
      icon: Compass,
    },
  ];

  const adminLinks: NavItem[] = [
    {
      to: "/admin/dashboard",
      label: "Analytics Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/admin/management",
      label: "Hospital Management",
      icon: Building2,
    },
    {
      to: "/patient/navigation",
      label: "Floor Directory",
      icon: Compass,
    },
  ];

  const links = role === "patient" ? patientLinks : role === "doctor" ? doctorLinks : adminLinks;

  const sidebarContent = (
    <aside className="w-64 h-[calc(100vh-4rem)] sticky top-16 bg-white border-r border-slate-200 flex flex-col justify-between p-4 overflow-y-auto">
      <div>
        {/* Role Portal Header */}
        <div className="mb-4 px-2 py-1 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {role === "patient" ? "Patient Navigation" : role === "doctor" ? "Clinical Operations" : "Hospital Admin"}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {role.toUpperCase()}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sky-50 text-sky-700 font-semibold shadow-xs shadow-sky-500/10 border border-sky-100"
                    : link.highlight
                    ? "text-slate-800 hover:bg-teal-50/70 hover:text-teal-700 bg-gradient-to-r from-teal-50/30 to-sky-50/30"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-sky-600"
                        : link.highlight
                        ? "text-teal-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span>{link.label}</span>
                </div>

                {link.badge !== undefined && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? "bg-sky-200/70 text-sky-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Emergency Banner & Disclaimer */}
      <div className="mt-6 space-y-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100 text-slate-800">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Contact</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            Immediate life-threatening issues? Call Emergency directly.
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-700">Dial 911 / Ext 102</span>
            <span className="text-[10px] bg-rose-200/60 text-rose-800 px-1.5 py-0.5 rounded font-medium">
              24/7
            </span>
          </div>
        </div>

        <div className="px-2 text-[10px] text-slate-400 text-center leading-relaxed">
          MediFlow AI v1.0 • Intelligent Triage & Flow
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0">{sidebarContent}</div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
