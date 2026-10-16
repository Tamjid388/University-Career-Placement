import { useState } from "react";
import {
  Bookmark,
  MapPin,
  Clock,
  Wallet,
  CalendarDays,
  Users,
  Building2,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import ApplyJob from "../detailsjob/ApplyJob.jsx";
import { useCurrentUser } from "../../hooks/useAuth.js";
import toast from "react-hot-toast";

const FALLBACK_LOGO = "/defavatar.png";

const JOB_TYPE_STYLES = {
  "full-time": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "part-time": "bg-sky-50 text-sky-700 ring-sky-200",
  internship: "bg-amber-50 text-amber-700 ring-amber-200",
  contract: "bg-violet-50 text-violet-700 ring-violet-200",
};

const formatSalary = (job) => {
  if (job?.isNegotiable) return "Negotiable";
  const min = job?.salaryRange?.min;
  const max = job?.salaryRange?.max;
  if (min == null && max == null) return "Not disclosed";
  const currency = job?.currency ? `${job.currency} ` : "";
  if (min != null && max != null) return `${currency}${min.toLocaleString()} – ${max.toLocaleString()}`;
  return `${currency}${(min ?? max).toLocaleString()}`;
};

const formatLocation = (job) => {
  const parts = [job?.location, job?.city, job?.country]
    .filter((p) => typeof p === "string" && p.trim())
    .filter((p, i, arr) => arr.indexOf(p) === i);
  return parts.length > 0 ? parts.join(", ") : "Remote / Flexible";
};

const getDeadlineInfo = (deadline) => {
  const date = deadline ? new Date(deadline) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  const daysLeft = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return { date, daysLeft };
};

const SingleJobCard = ({ job, setActiveJobId, activeJobId, handleApply }) => {
  const { data: user } = useCurrentUser();
  const [saved, setSaved] = useState(false);

  const handleApplyNow = (jobId) => {
    if (!user) {
      toast.error("Please login to apply for this job.");
      return;
    }
    setActiveJobId(jobId);
  };

  const deadline = getDeadlineInfo(job?.deadline);
  const skills = Array.isArray(job?.skillsRequired) ? job.skillsRequired : [];
  const jobTypeStyle = JOB_TYPE_STYLES[job?.jobType] ?? "bg-gray-100 text-gray-700 ring-gray-200";

  return (
    <article className="group bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:border-purple-200 hover:-translate-y-0.5 transition-all duration-300 w-full">
      {/* Header: logo + title + bookmark */}
      <div className="flex items-start gap-4">
        <img
          src={job?.company?.logo || FALLBACK_LOGO}
          alt={`${job?.company?.name || "Company"} logo`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_LOGO;
          }}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 ring-1 ring-gray-200 bg-gray-50"
        />
        <div className="min-w-0 flex-1">
          <Link to={`/job/details/${job._id}`} className="hover:text-purple-700 transition-colors">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors">
              {job.title}
            </h3>
          </Link>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500 truncate">
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="truncate font-medium">{job?.company?.name || "Company"}</span>
            {job?.company?.badges === "trusted" && (
              <span className="shrink-0 text-[11px] font-semibold bg-purple-600 text-white px-2 py-0.5 rounded-full">
                Trusted
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          aria-label={saved ? "Remove bookmark" : "Bookmark job"}
          aria-pressed={saved}
          onClick={() => setSaved((s) => !s)}
          className={`shrink-0 p-2 rounded-full ring-1 transition-all ${
            saved
              ? "bg-purple-600 text-white ring-purple-600"
              : "text-gray-400 ring-gray-200 hover:text-purple-600 hover:ring-purple-300 hover:bg-purple-50"
          }`}
        >
          <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Attribute chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {job?.jobType && (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ring-1 ${jobTypeStyle}`}>
            {job.jobType}
          </span>
        )}
        {job?.jobLevel && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 ring-1 ring-gray-200">
            {job.jobLevel} level
          </span>
        )}
        {job?.jobShift && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 ring-1 ring-gray-200">
            {job.jobShift} shift
          </span>
        )}
        {job?.vacancy && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 ring-1 ring-gray-200">
            <Users className="w-3.5 h-3.5" />
            {job.vacancy} {Number(job.vacancy) === 1 ? "vacancy" : "vacancies"}
          </span>
        )}
      </div>

      {/* Key info grid */}
      <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
        <div className="flex items-center gap-2 text-gray-600 min-w-0">
          <MapPin className="w-4 h-4 shrink-0 text-purple-600" />
          <span className="truncate capitalize">{formatLocation(job)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 min-w-0">
          <Wallet className="w-4 h-4 shrink-0 text-purple-600" />
          <span className="font-semibold text-gray-900 truncate">
            {formatSalary(job)}
            <span className="font-normal text-gray-500"> /{job?.salaryType || "Monthly"}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4 shrink-0 text-purple-600" />
          <span>
            Posted{" "}
            {job?.createdAt && !Number.isNaN(new Date(job.createdAt).getTime())
              ? new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "recently"}
          </span>
        </div>
        {deadline && (
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays className="w-4 h-4 shrink-0 text-purple-600" />
            <span>
              Apply by{" "}
              <span className="font-semibold text-gray-900">
                {deadline.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>{" "}
              {deadline.daysLeft >= 0 ? (
                <span
                  className={`ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    deadline.daysLeft <= 7
                      ? "bg-red-50 text-red-600"
                      : deadline.daysLeft <= 30
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {deadline.daysLeft === 0 ? "Last day" : `${deadline.daysLeft}d left`}
                </span>
              ) : (
                <span className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  Closed
                </span>
              )}
            </span>
          </div>
        )}
      </dl>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((skill) => (
            <span key={skill} className="text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md font-medium">
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-xs text-gray-500 px-2 py-1 font-medium">+{skills.length - 4} more</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2.5">
        <Link to={`/job/details/${job._id}`} className="flex-1">
          <span className="w-full inline-flex items-center justify-center gap-1 text-sm font-semibold border border-purple-600 text-purple-600 py-2.5 px-4 rounded-xl hover:bg-purple-50 transition-colors">
            Learn More
            <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
        <button
          onClick={() => handleApplyNow(job._id)}
          className="flex-1 text-sm font-semibold bg-purple-600 text-white py-2.5 px-4 rounded-xl hover:bg-purple-700 active:scale-[0.99] transition-all shadow-sm shadow-purple-200"
        >
          Apply Now
        </button>
      </div>

      {activeJobId === job._id && (
        <ApplyJob
          isOpen={true}
          onClose={() => setActiveJobId(null)}
          onSubmit={handleApply}
          jobId={job._id}
        />
      )}
    </article>
  );
};

export default SingleJobCard;
