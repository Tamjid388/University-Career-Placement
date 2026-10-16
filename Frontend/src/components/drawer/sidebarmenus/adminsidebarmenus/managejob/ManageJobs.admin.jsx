import React, { useEffect, useState } from "react";
import { UseJobsForAdmin } from "../../../../../hooks/useJobs";
import DashboardManageCompanySkeleton from "../../../../loading/DashboardManageCompanySkeleton";
import { UseupdateJobStatus } from "../../../../../hooks/useAdmin";
import Pagination from "../../../../shared/pagination/Pagination.jsx";
import { Action } from "./Action";

export const ManageJobs = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setPage(1);
  }, [status, limit]);

  const { data, isPending, isFetching } = UseJobsForAdmin({
    page,
    limit,
    ...(status ? { status } : {}),
  });
  const jobs = data?.jobs || [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  console.log(data);
 const {mutate}=UseupdateJobStatus()

  if (isPending) {
    return <DashboardManageCompanySkeleton />;
  }

  return (
    <div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">Manage Jobs</h2>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select select-sm select-bordered"
        >
          <option value="">All statuses</option>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Job Title</th>
              <th>Industry</th>
              <th>Status</th>
              <th>Posted On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs && jobs.length > 0 ? (
              jobs.map((job, index) => (
                <tr key={job._id} className="hover">
                  <th>{(page - 1) * limit + index + 1}</th>
                  <td className="min-w-0 max-w-[240px]">
                    <div className="min-w-0">
                      <div className="font-bold truncate" title={job.title}>{job.title}</div>
                      <div className="text-sm opacity-50 truncate">
                        {job.company?.name || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td>{job.industry || "—"}</td>
                  <td>
                    <span
                      className={`badge capitalize ${
                        job.status === "approved"
                          ? "badge-success"
                          : job.status === "pending"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>

                  <Action id={job._id}/>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  No jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
