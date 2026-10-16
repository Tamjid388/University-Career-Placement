import { useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { GiMoneyStack } from "react-icons/gi";
import { MdOutlineLocationOn } from "react-icons/md";
import { RxTimer } from "react-icons/rx";
import { Link } from "react-router";

const FALLBACK_LOGO = "/fallback-logo.png";

const formatLocation = (job) => {
  const parts = [job?.location, job?.city, job?.country]
    .filter((p) => typeof p === "string" && p.trim())
    .filter((p, i, arr) => arr.indexOf(p) === i);
  return parts.length > 0 ? parts.join(", ") : "Remote / Flexible";
};

const formatSalary = (job) => {
  if (job?.isNegotiable) return "Negotiable";
  const min = job?.salaryRange?.min;
  const max = job?.salaryRange?.max;
  if (min == null && max == null) return "Salary not disclosed";
  const currency = job?.currency ? `${job.currency} ` : "";
  if (min != null && max != null) return `${currency}${min} - ${max}`;
  return `${currency}${min ?? max}`;
};

const formatDateLine = (job) => {
  const deadline = job?.deadline ? new Date(job.deadline) : null;
  if (deadline && !Number.isNaN(deadline.getTime()) && deadline > new Date()) {
    return `Apply by ${deadline.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}`;
  }
  const created = job?.createdAt ? new Date(job.createdAt) : null;
  if (!created || Number.isNaN(created.getTime())) return "Recently posted";
  const days = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 30) return `Posted ${days} days ago`;
  return `Posted ${created.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}`;
};

const JobsCards = ({ job }) => {
  const [saved, setSaved] = useState(false);

  return (
    <article className="home-card hover:bg-purple-50/50 relative">
      <Link to={`/job/details/${job._id}`} className="block p-5 pr-14 w-full min-w-0">
        <div className="flex items-center gap-4 min-w-0">
          <img
            src={job?.company?.logo || FALLBACK_LOGO}
            alt={`${job?.company?.name || "Company"} logo`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_LOGO;
            }}
            className="w-14 h-14 rounded-md object-cover shrink-0 bg-base-200"
          />
          <div className="min-w-0">
            <h3 className="card-title text-start line-clamp-2">
              {job.title}
            </h3>
            <p className="card-body-text mt-1 text-start truncate">
              {job?.company?.name || "Company"}
            </p>
          </div>
        </div>

        <div className="font-roboto mt-4 flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
          {job?.jobType && <span className="home-chip">{job.jobType}</span>}
          <span className="flex items-center gap-1 min-w-0 max-w-full">
            <MdOutlineLocationOn className="text-xl shrink-0" aria-hidden="true" />
            <span className="truncate">{formatLocation(job)}</span>
          </span>
          <span className="flex items-center gap-1">
            <RxTimer className="text-xl" aria-hidden="true" />
            {formatDateLine(job)}
          </span>
          <span className="flex items-center gap-1">
            <GiMoneyStack className="text-xl" aria-hidden="true" />
            {formatSalary(job)}
          </span>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => setSaved((s) => !s)}
        aria-pressed={saved}
        aria-label={saved ? "Remove saved job" : "Save job"}
        className={`absolute top-4 right-4 p-1 rounded-md transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 ${
          saved ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <CiBookmark className={`text-xl ${saved ? "fill-current" : ""}`} />
      </button>
    </article>
  );
};

export default JobsCards;
