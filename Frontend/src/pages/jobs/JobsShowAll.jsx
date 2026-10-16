import { useEffect, useState } from "react";
import { UseJobs } from "../../hooks/useJobs.js";

import SingleJobCard from "../../components/jobs/SingleJobCard.jsx";
import AllJobsSkeleton from "../../components/loading/AllJobsSkeleton.jsx";
import NotFound from "../../components/jobs/NotFound.jsx";
import Pagination from "../../components/shared/pagination/Pagination.jsx";
import { useCurrentUser } from "../../hooks/useAuth.js";

const JOB_TYPES = ["full-time", "part-time", "internship", "contract"];

const INDUSTRIES = [
  "Information Technology",
  "Healthcare",
  "Education",
  "Finance & Banking",
  "Manufacturing",
  "Construction",
  "Transportation & Logistics",
  "Retail & E-commerce",
  "Telecommunications",
  "Media & Entertainment",
  "Energy & Utilities",
  "Agriculture",
  "Real Estate",
  "Government & Public Sector",
  "Hospitality & Tourism",
  "Legal Services",
  "Non-Profit / NGOs",
  "Aerospace & Defense",
  "Automotive",
  "Biotechnology & Pharmaceuticals",
  "Software",
  "others",
];

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first", sortBy: "createdAt", order: "desc" },
  { value: "createdAt:asc", label: "Oldest first", sortBy: "createdAt", order: "asc" },
  { value: "title:asc", label: "Title A–Z", sortBy: "title", order: "asc" },
  { value: "deadline:asc", label: "Deadline (soonest)", sortBy: "deadline", order: "asc" },
];

const JOBS_PER_PAGE = 12;

const JobsShowAll = () => {
  const { data: user } = useCurrentUser();
  console.log("cyrrent", user);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    jobType: "",
  });
  const [sortValue, setSortValue] = useState("createdAt:desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(JOBS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [filters, sortValue, limit]);

  const sortOption = SORT_OPTIONS.find((o) => o.value === sortValue) ?? SORT_OPTIONS[0];
  const params = {
    page,
    limit,
    sortBy: sortOption.sortBy,
    order: sortOption.order,
    ...(filters.keyword.trim() ? { jobTitle: filters.keyword.trim() } : {}),
    ...(filters.location.trim() ? { location: filters.location.trim() } : {}),
    ...(filters.category ? { industry: filters.category } : {}),
    ...(filters.jobType ? { jobType: filters.jobType } : {}),
  };
  const { data, isPending, error, isFetching } = UseJobs(params);
  const jobs = data?.jobs || [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const [activeJobId, setActiveJobId] = useState(null);

  const handleApply = (applicationData) => {
    console.log("Application submitted", applicationData);
    setActiveJobId(null);
  };

  const handlePageChange = (next) => {
    setPage(next);
    setActiveJobId(null);
  };

  const handleClearFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      category: "",
      jobType: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar Filters */}
      <aside className="bg-gray-50 p-6 rounded-xl shadow-md md:sticky top-6 space-y-6 overflow-y-auto md:h-screen">
        {/* Keyword */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Search by Keywords
          </label>
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, keyword: e.target.value }))
            }
            placeholder="Job title, keywords..."
            className="w-full border border-gray-300 p-3 rounded-lg focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
          />
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-semibold mb-2">Job Type</label>
          <select
            value={filters.jobType}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, jobType: e.target.value }))
            }
            className="w-full border border-gray-300 p-3 rounded-lg focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
          >
            <option value="">Choose a job type</option>
            {JOB_TYPES.map((type) => (
              <option key={type} value={type} className="capitalize">
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold mb-2">Location</label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, location: e.target.value }))
            }
            placeholder="City or location"
            className="w-full border border-gray-300 p-3  rounded-lg focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
          />
        </div>

        {/* Category / Industry */}
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full border border-gray-300 p-3  rounded-lg focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
          >
            <option className="px-4" value="">Choose a category</option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold mb-2">Sort by</label>
          <select
            value={sortValue}
            onChange={(e) => setSortValue(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={handleClearFilters}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Clear Filters
        </button>
      </aside>

      {/* Job List */}
      <div className="lg:col-span-2 space-y-5">
        {!isPending && !error && (
          <p className="text-sm text-gray-500" role="status">
            Showing{" "}
            <span className="font-semibold text-gray-800">{jobs.length}</span>{" "}
            of <span className="font-semibold text-gray-800">{total}</span>{" "}
            {total === 1 ? "job" : "jobs"}
            {isFetching && (
              <span className="ml-2 text-purple-600 font-medium">Updating…</span>
            )}
          </p>
        )}
        {isPending && <AllJobsSkeleton />}
        {error && <div className="text-red-500">Something went wrong loading jobs!</div>}

        {!isPending && !error && jobs.length === 0 && <NotFound />}

        {!isPending &&
          !error &&
          jobs.length > 0 &&
          jobs.map((job) => (
            <SingleJobCard
              key={job._id}
              job={job}
              activeJobId={activeJobId}
              setActiveJobId={setActiveJobId}
              handleApply={handleApply}
            />
          ))}

        {!isPending && !error && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={(next) => {
              setLimit(next);
              setPage(1);
            }}
            isLoading={isFetching}
          />
        )}
      </div>
    </div>
  );
};

export default JobsShowAll;
