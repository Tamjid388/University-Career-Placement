import { FaRegFileAlt } from "react-icons/fa";
import { PiUsersBold } from "react-icons/pi";
import { SlBadge } from "react-icons/sl";
import { GoGraph } from "react-icons/go";
import { ClipboardList, Award } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAdminStatistics } from "../../../../../hooks/useStatistics";
import { Spinner } from "../../../../loading/loader/Spinner";

const STATUS_COLORS = {
  pending: "#f59e0b",
  accepted: "#10b981",
  approved: "#10b981",
  rejected: "#ef4444",
  scheduled: "#3b82f6",
};
const FALLBACK_COLORS = ["#8b5cf6", "#6366f1", "#e879f9", "#22d3ee", "#f472b6"];
const ROLE_COLORS = ["#8b5cf6", "#22c55e", "#f59e0b", "#3b82f6", "#ef4444"];

const colorFor = (name, index = 0) => {
  const key = (name || "").toLowerCase();
  return STATUS_COLORS[key] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
};

const prettify = (s) =>
  s === "job-seeker" ? "Job Seekers" : s.charAt(0).toUpperCase() + s.slice(1);

export const AdminDashboardMenu = () => {
  const { data: stats, isPending } = useAdminStatistics();

  if (isPending) {
    return <Spinner />;
  }

  const cardData = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      subtitle: "All registered users",
      icon: <PiUsersBold />,
    },
    {
      title: "Total Job Seekers",
      value: stats?.totalJobSeekers ?? 0,
      subtitle: "Registered job seekers",
      icon: <SlBadge />,
    },
    {
      title: "Total Employers",
      value: stats?.totalEmployers ?? 0,
      subtitle: "Registered employers",
      icon: <FaRegFileAlt />,
    },
    {
      title: "Active Jobs",
      value: stats?.totalJobs ?? 0,
      subtitle: "Total job posts",
      icon: <GoGraph />,
    },
    {
      title: "Total Applications",
      value: stats?.totalApplications ?? 0,
      subtitle: "Across all jobs",
      icon: <ClipboardList />,
    },
    {
      title: "Skill Attempts",
      value: `${stats?.skillAttempts?.completed ?? 0}/${stats?.skillAttempts?.total ?? 0}`,
      subtitle: "Completed / total",
      icon: <Award />,
    },
  ];

  const usersByRole = (stats?.usersByRole || []).map((r) => ({
    name: prettify(r._id || "Unknown"),
    value: r.count,
  }));

  const applicationsByStatus = (stats?.applicationsByStatus || []).map((s) => ({
    status: prettify(s._id || "Unknown"),
    count: s.count,
  }));

  const jobsOverTime = (stats?.jobsOverTime || []).map((j) => ({
    month: j._id,
    jobs: j.count,
  }));

  const jobsByStatus = (stats?.jobsByStatus || []).map((s) => ({
    name: prettify(s._id || "Unknown"),
    value: s.count,
  }));

  return (
    <div className="space-y-6 px-4 pb-8">
      <div>
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-r-primary)]">Admin Dashboard</h1>
          <p className="mb-4 text-lg font-medium opacity-80 mt-3 text-[var(--color-text)]">
            Track job seekers, manage jobs, and monitor application progress
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardData.map((card, index) => (
            <div
              key={index}
              className={`rounded-xl p-5 shadow-md border-1 border-gray-200  transition-transform hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-r-primary">{card.title}</h2>

                <p className="font-bold text-black/80">{card.icon}</p>
              </div>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
              <p className="text-sm mt-1">{card.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
      <hr />
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-md">
          <h2 className="text-xl font-bold">Users by Role</h2>
          <p className="text-sm text-gray-500 mb-4">Platform user distribution</p>
          {usersByRole.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usersByRole}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {usersByRole.map((entry, index) => (
                    <Cell
                      key={`role-${index}`}
                      fill={ROLE_COLORS[index % ROLE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 py-10 text-center">No user data yet.</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-md">
          <h2 className="text-xl font-bold">Applications by Status</h2>
          <p className="text-sm text-gray-500 mb-4">Hiring pipeline overview</p>
          {applicationsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationsByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="status" stroke="#6b7280" />
                <YAxis allowDecimals={false} stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {applicationsByStatus.map((entry, index) => (
                    <Cell key={`app-${index}`} fill={colorFor(entry.status, index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 py-10 text-center">No application data yet.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-md">
        <h2 className="text-xl font-bold">Jobs Posted Over Time</h2>
        <p className="text-sm text-gray-500 mb-4">Monthly job posting trend (last 8 months)</p>
        {jobsOverTime.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis allowDecimals={false} stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="jobs" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 py-10 text-center">No job data yet.</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-md">
          <h2 className="text-xl font-bold">Jobs by Status</h2>
          <p className="text-sm text-gray-500 mb-4">Approval pipeline</p>
          {jobsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={jobsByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {jobsByStatus.map((entry, index) => (
                    <Cell key={`job-${index}`} fill={colorFor(entry.name, index)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 py-10 text-center">No job data yet.</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-md flex flex-col">
          <h2 className="text-xl font-bold">Skill Assessment Activity</h2>
          <p className="text-sm text-gray-500 mb-4">Attempts completed by job seekers</p>
          <div className="flex-1 flex items-center justify-center gap-8 py-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600">
                {stats?.skillAttempts?.total ?? 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total attempts</p>
            </div>
            <div className="w-px h-16 bg-gray-200" />
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">
                {stats?.skillAttempts?.completed ?? 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Completed</p>
            </div>
            <div className="w-px h-16 bg-gray-200" />
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-800">
                {stats?.skillAttempts?.total
                  ? Math.round(
                      ((stats?.skillAttempts?.completed ?? 0) /
                        stats.skillAttempts.total) *
                        100
                    )
                  : 0}
                %
              </p>
              <p className="text-sm text-gray-500 mt-1">Completion rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
