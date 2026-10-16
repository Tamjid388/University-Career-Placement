import React, { useState } from "react";
import { UseMyJobs } from "../../../../../hooks/useJobs";
import { format } from "date-fns";
import PostedJobsSkeleton from "../../../../loading/PostedJobsSkeleton.jsx";
import { Link } from "react-router";
import { PostedJobActions } from "./PostedJobActions.jsx";
import Pagination from "../../../../shared/pagination/Pagination.jsx";

export const PostedJobs = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: allJobs, isLoading, isFetching } = UseMyJobs({ page, limit });
  const jobs = allJobs?.jobs || [];
  const total = allJobs?.total ?? 0;
  const totalPages = allJobs?.totalPages ?? 1;


  if (isLoading) return <PostedJobsSkeleton />;

  return (
    <div
      className="overflow-x-auto bg-white p-5 md:mx-5 
    rounded-xl shadow-lg border border-gray-300 mb-6"
    >
      <h2 className="text-xl font-semibold mb-4">My Posted Jobs</h2>

      {jobs.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No jobs have been posted yet.
        </div>
      ) : (
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th>Job</th>
              <th>Type</th>
              <th>Company Location</th>
              <th>Salary</th>
              <th>Deadline</th>
              <th>Applicants</th>
              <th>Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {jobs.map((job) => (
              <tr key={job._id} className="hover">
                {/* Job title + logo + company */}
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 h-10 mask mask-squircle">
                        <img
                          src={job?.company?.logo || "/default-logo.png"}
                          alt="logo"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {job?.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {job?.company?.name}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Job Type */}
                <td>
                  <span className="badge bg-blue-100 text-blue-700 capitalize">
                    {job?.jobType || "N/A"}
                  </span>
                </td>

                {/* Location */}
                <td>{job?.company?.location || "Remote"}</td>

                {/* Salary */}
                <td>
                  <div className="font-medium">
                    {job?.currency} {job?.salaryRange?.min?.toLocaleString()} -{" "}
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
                <td>
                  <span className="text-sm text-gray-700">
                    {format(new Date(job?.deadline), "dd MMM yyyy")}
                  </span>
                </td>

                {/* Applicants */}
                <td>
                  <span className="badge badge-outline">0</span>
                </td>

                {/* Posted Date */}
                <td>
                  <span className="text-sm text-gray-600">
                    {format(new Date(job?.createdAt), "dd MMM yyyy")}
                  </span>
                </td>

                <PostedJobActions job={job} />
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Handaling pagination controls */}

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

    {/* .... */}
    </div>
  );
};

