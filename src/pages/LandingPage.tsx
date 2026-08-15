import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  Sparkles,
  CalendarCheck,
  Ticket,
  FileText,
  Compass,
  Stethoscope,
  ShieldCheck,
  Users,
  Building2,
  ArrowRight,
  CheckCircle2,
  Clock,
  HeartPulse,
  ChevronRight,
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { DisclaimerBanner } from "../components/common/DisclaimerBanner";
import { UserRole } from "../types";

export const LandingPage: React.FC = () => {
  const { switchUser } = useHospital();
  const navigate = useNavigate();

  const handleRoleQuickStart = (role: UserRole) => {
    switchUser(role);
    if (role === "patient") navigate("/patient/dashboard");
    else if (role === "doctor") navigate("/doctor/dashboard");
    else if (role === "admin") navigate("/admin/dashboard");
  };

  const featureCards = [
    {
      icon: Sparkles,
      title: "AI Patient Intake",
      description:
        "Conversational symptom collection that structures patient complaints and routes them to the appropriate hospital department.",
      color: "from-sky-500 to-teal-500",
      bgLight: "bg-sky-50 text-sky-600",
      link: "/patient/intake",
    },
    {
      icon: CalendarCheck,
      title: "Smart Appointments",
      description:
        "Seamless outpatient scheduling with doctor availability, department matching, and instant token generation.",
      color: "from-teal-500 to-emerald-500",
      bgLight: "bg-teal-50 text-teal-600",
      link: "/patient/appointments",
    },
    {
      icon: Ticket,
      title: "Token & Queue Management",
      description:
        "Real-time queue tracking, live token displays, wait-time estimations, and automated SMS/portal alerts.",
      color: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50 text-amber-600",
      link: "/patient/queue",
    },
    {
      icon: FileText,
      title: "Medical Report Explanation",
      description:
        "Plain-language AI translations for complex diagnostic lab values and medical terminology for patient empowerment.",
      color: "from-indigo-500 to-blue-500",
      bgLight: "bg-indigo-50 text-indigo-600",
      link: "/patient/reports",
    },
    {
      icon: Compass,
      title: "Hospital Navigation",
      description:
        "Interactive floor-by-floor hospital wayfinding with intelligent search for rooms, diagnostic labs, and wards.",
      color: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-50 text-purple-600",
      link: "/patient/navigation",
    },
    {
      icon: Stethoscope,
      title: "Doctor AI Summary",
      description:
        "Structured clinical summaries extracting patient history, vital complaints, and lab highlights for physicians before consults.",
      color: "from-blue-600 to-cyan-600",
      bgLight: "bg-blue-50 text-blue-600",
      link: "/doctor/dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-sky-50/60 via-white to-slate-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold shadow-xs mb-6">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span>Next-Gen Hospital Care & Patient Flow</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              MediFlow <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">AI</span>
            </h1>

            {/* Tagline */}
            <p className="mt-3 text-xl sm:text-2xl font-semibold text-slate-700">
              Smarter Hospital Assistance. Simpler Patient Care.
            </p>

            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              An intelligent hospital management and patient-support ecosystem connecting patients, physicians, and administrators with streamlined AI triage, live queue tracking, and document translation.
            </p>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/patient/intake"
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-600/25 hover:shadow-xl hover:shadow-sky-600/30 transition-all flex items-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-sky-200 group-hover:rotate-12 transition-transform" />
                <span>Get Started with AI Intake</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-all"
              >
                Sign In to Portal
              </Link>
            </div>

            {/* Role Quick Selector Cards */}
            <div className="mt-12 pt-8 border-t border-slate-200/80">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Select Your Portal Role to Experience MediFlow AI
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto text-left">
                {/* Patient */}
                <button
                  type="button"
                  onClick={() => handleRoleQuickStart("patient")}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
                  </div>
                  <div className="mt-3 font-bold text-sm text-slate-900">Patient Login</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Intake, appointments, tokens & reports
                  </div>
                </button>

                {/* Doctor */}
                <button
                  type="button"
                  onClick={() => handleRoleQuickStart("doctor")}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="mt-3 font-bold text-sm text-slate-900">Doctor Login</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Live patient queue & AI summaries
                  </div>
                </button>

                {/* Admin */}
                <button
                  type="button"
                  onClick={() => handleRoleQuickStart("admin")}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <div className="mt-3 font-bold text-sm text-slate-900">Admin Login</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Analytics & hospital CRUD management
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              End-to-End Hospital Assistance Modules
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed to eliminate waiting room bottlenecks, assist clinical teams, and give patients crystal-clear guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl ${feat.bgLight} flex items-center justify-center mb-5`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={feat.link}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
                    >
                      <span>Explore Module</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <span className="text-[11px] text-slate-400 font-medium">Ready</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hospital Metrics Highlights */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-600">42%</div>
              <div className="text-xs text-slate-600 font-medium mt-1">Reduced Triage Wait Times</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-600">99.2%</div>
              <div className="text-xs text-slate-600 font-medium mt-1">Department Routing Precision</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600">100%</div>
              <div className="text-xs text-slate-600 font-medium mt-1">Non-Diagnostic Safety Compliance</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">24/7</div>
              <div className="text-xs text-slate-600 font-medium mt-1">Wayfinding & Inpatient Flow</div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical AI Safety Disclaimer Banner (Prominent near bottom) */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <DisclaimerBanner />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Activity className="w-4 h-4 text-sky-600" />
            <span>MediFlow AI</span>
            <span className="text-[11px] font-normal text-slate-500">
              — Intelligent Hospital Assistance & Patient Flow Management
            </span>
          </div>
          <div>
            Built with React, Vite, Tailwind CSS, and Google Gemini API
          </div>
        </div>
      </footer>
    </div>
  );
};
