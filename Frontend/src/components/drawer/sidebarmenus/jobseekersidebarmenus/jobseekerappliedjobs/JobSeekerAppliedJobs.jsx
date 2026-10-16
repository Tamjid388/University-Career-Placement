import React, { useEffect, useState } from "react";
import PostedJobsSkeleton from "../../../../loading/PostedJobsSkeleton.jsx";
import { UseJobSeekerApplications } from "../../../../../hooks/useApplication.js";
import { format } from "date-fns";
import { Link } from "react-router";
import Pagination from "../../../../shared/pagination/Pagination.jsx";

const JobSeekerAppliedJobs = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setPage(1);
  }, [status, limit]);

  const { data, isLoading, isFetching } = UseJobSeekerApplications({
    page,
    limit,
    ...(status ? { status } : {}),
  });
  const jobs = data?.applications || [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const [now, setNow] = useState(new Date());

  // Update current time every minute for live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <PostedJobsSkeleton />;

  return (
    <div>
      <div className=" overflow-x-auto bg-white p-5 md:mx-5 rounded-xl shadow-lg border border-gray-300">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold">Applied Jobs</h2>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select select-sm select-bordered"
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            You haven’t applied to any jobs yet.
          </div>
        ) : (
          <table className="table w-full">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th>Job</th>
                <th>Type</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Interview</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {jobs.map((application) => {
                const job = application.job;
                const interview = application.interview;
                const interviewTime = interview?.scheduledAt
                  ? new Date(interview.scheduledAt)
                  : null;
                const showJoinButton =
                  interview?.mode === "Online" &&
                  interviewTime &&
                  interviewTime > now;

                return (
                  <tr key={application._id} className="hover">
                    {/* Job Info */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-gray-800">
                            {job?.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {job?.company?.name || "Company"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td>
                      <span className="badge bg-blue-100 text-blue-700 capitalize">
                        {job?.jobType || "N/A"}
                      </span>
                    </td>

                    {/* Location */}
                    <td>{job?.location || "Remote"}</td>

                    {/* Salary */}
                    <td>
                      <div className="font-medium">
                        {job?.currency}{" "}
                        {job?.salaryRange?.min?.toLocaleString()} -{" "}
                        {job?.salaryRange?.max?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {job?.salaryType}{" "}
                        {job?.isNegotiable && (
                          <span className="badge badge-ghost text-green-600 border-green-300">
                            Negotiable
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Deadline */}
                    <td>{job?.deadline ? format(new Date(job.deadline), "dd MMM yyyy") : "—"}</td>

                    {/* Status */}
                    <td>
                      <span className="badge badge-outline">
                        {application.status || "Pending"}
                      </span>
                    </td>

                    {/* Interview Info */}
                    <td>
                      {interview ? (
                        <div className="space-y-1">
                          <div className="text-sm text-gray-700">
                            {format(interviewTime, "dd MMM yyyy, hh:mm a")}
                          </div>

                          {showJoinButton && (
                            <a
                              href={interview?.locationOrLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-xs bg-green-100 text-green-700 border border-green-300 mt-1"
                            >
                              Join Meeting
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Not Scheduled
                        </span>
                      )}
                    </td>

                    {/* Posted */}
                    <td>{job?.createdAt ? format(new Date(job.createdAt), "dd MMM yyyy") : "—"}</td>

                    {/* Actions */}
                    <td className="flex flex-col gap-2">
                      <Link
                        to={`/job/details/${job?._id}`}
                        className="btn btn-xs bg-r-primary text-white hover:bg-r-primary/90 border-none"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(next) => {
            setLimit(next);
            setPage(1);
          }}
          isLoading={isFetching}
        />
      </div>
    </div>
  );
};

export default JobSeekerAppliedJobs;
