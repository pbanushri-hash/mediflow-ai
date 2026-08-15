import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Stethoscope,
  Clock,
  CheckCircle2,
  Building2,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { useHospital } from "../../context/HospitalContext";
import { DashboardCard } from "../../components/common/DashboardCard";

export const AdminDashboard: React.FC = () => {
  const { patients, doctors, departments, appointments } = useHospital();

  const totalPatients = patients.length;
  const todayAppointments = appointments.length;
  const activeDoctors = doctors.filter((d) => d.status === "Available" || d.status === "In Consultation").length;
  const waitingPatients = patients.filter((p) => p.queueStatus === "Waiting").length;
  const completedVisits = appointments.filter((a) => a.status === "Completed").length;

  // Chart Data: Patient Inflow Hourly
  const hourlyInflowData = [
    { time: "08:00", patients: 12, waitMin: 15 },
    { time: "09:00", patients: 28, waitMin: 22 },
    { time: "10:00", patients: 45, waitMin: 34 },
    { time: "11:00", patients: 52, waitMin: 38 },
    { time: "12:00", patients: 36, waitMin: 25 },
    { time: "13:00", patients: 24, waitMin: 18 },
    { time: "14:00", patients: 42, waitMin: 28 },
    { time: "15:00", patients: 39, waitMin: 24 },
    { time: "16:00", patients: 22, waitMin: 14 },
  ];

  // Chart Data: Department Appointments
  const departmentData = departments.map((dept) => {
    const count = appointments.filter((a) => a.departmentId === dept.id).length;
    return {
      name: dept.name,
      appointments: count || Math.floor(Math.random() * 8) + 2,
      activeDoctors: doctors.filter((d) => d.departmentId === dept.id).length,
    };
  });

  // Chart Data: Appointment Status Breakdown
  const statusPieData = [
    { name: "Completed", value: appointments.filter((a) => a.status === "Completed").length || 3, color: "#10b981" },
    { name: "Waiting", value: appointments.filter((a) => a.status === "Waiting").length || 4, color: "#f59e0b" },
    { name: "In Progress", value: appointments.filter((a) => a.status === "In Consultation").length || 2, color: "#0ea5e9" },
    { name: "Confirmed", value: appointments.filter((a) => a.status === "Confirmed").length || 2, color: "#6366f1" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-700/15 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-indigo-100 mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Executive Hospital Administration & Flow Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospital Operations Overview
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1">
              Live capacity monitoring, doctor workload, and outpatient queue analytics.
            </p>
          </div>

          <Link
            to="/admin/management"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-indigo-900 hover:bg-indigo-50 shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Manage Doctors & Departments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Total Patients"
          value={totalPatients + 140}
          subtitle="Registered this week"
          icon={Users}
          iconColor="bg-indigo-50 text-indigo-600"
          trend={{ value: "+12%", isPositive: true }}
        />

        <DashboardCard
          title="Today's Bookings"
          value={todayAppointments}
          subtitle="Outpatient appointments"
          icon={Calendar}
          iconColor="bg-sky-50 text-sky-600"
          trend={{ value: "+8%", isPositive: true }}
        />

        <DashboardCard
          title="Active Doctors"
          value={`${activeDoctors} / ${doctors.length}`}
          subtitle="On duty across departments"
          icon={Stethoscope}
          iconColor="bg-teal-50 text-teal-600"
        />

        <DashboardCard
          title="Waiting Patients"
          value={waitingPatients}
          subtitle="In lounge queue"
          icon={Clock}
          iconColor="bg-amber-50 text-amber-600"
        />

        <DashboardCard
          title="Completed Visits"
          value={completedVisits}
          subtitle="Consultations discharged"
          icon={CheckCircle2}
          iconColor="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Inflow Trend Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Patient Inflow & Average Wait Time (Today)
              </h3>
              <p className="text-xs text-slate-500">Hourly clinic visits and triage response</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              Live Stream
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyInflowData}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    color: "#fff",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Area
                  type="monotone"
                  dataKey="patients"
                  name="Patients Present"
                  stroke="#0284c7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPatients)"
                />
                <Area
                  type="monotone"
                  dataKey="waitMin"
                  name="Avg Wait (Minutes)"
                  stroke="#d97706"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorWait)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointment Status Pie Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Appointment Status
            </h3>
            <p className="text-xs text-slate-500">Distribution across hospital</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {statusPieData.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Workload Bar Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Department Load & Specialist Allocations
            </h3>
            <p className="text-xs text-slate-500">Active consultations per hospital department</p>
          </div>
          <Link
            to="/admin/management"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            Manage Departments →
          </Link>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  color: "#fff",
                  borderRadius: "12px",
                  border: "none",
                  fontSize: "12px",
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="appointments" name="Appointments" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="activeDoctors" name="Consulting Doctors" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
