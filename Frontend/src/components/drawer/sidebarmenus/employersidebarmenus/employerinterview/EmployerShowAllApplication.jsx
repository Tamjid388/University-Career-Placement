import React, { useEffect, useState } from "react";
import { UseInterviewSheddule } from "../../../../../hooks/useInterview.js";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import PostedJobsSkeleton from "../../../../loading/PostedJobsSkeleton.jsx";
import Pagination from "../../../../shared/pagination/Pagination.jsx";

const EmployerShowAllApplication = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setPage(1);
  }, [status, limit]);

  const { data, isLoading, isFetching, isError, error } = UseInterviewSheddule({
    page,
    limit,
    ...(status ? { status } : {}),
  });
  const interviews = data?.interviews || [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;



  if (isLoading) return <PostedJobsSkeleton />;

  if (isError) {
    return (
      <div className="text-red-600 flex items-center gap-2 p-4 bg-red-100 border border-red-300 rounded-md shadow-sm">
        <AlertCircle className="w-5 h-5" />
        {error?.response?.data?.message || "Failed to load interviews"}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 mt-8 overflow-x-auto border border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          📅 Scheduled Interviews
        </h2>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select select-sm select-bordered"
        >
          <option value="">All statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {interviews.length === 0 ? (
        <p className="text-gray-500">No interviews scheduled yet.</p>
      ) : (
        <>
        <div className="w-full">
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr className="text-left text-sm font-semibold">
                <th className="px-5 py-3">👤 Candidate</th>
                <th className="px-5 py-3">✉️ Email</th>
                <th className="px-5 py-3">💼 Job Title</th>
                <th className="px-5 py-3">📅 Scheduled At</th>
                <th className="px-5 py-3">📡 Mode</th>
                <th className="px-5 py-3">🔗 Link / Location</th>
                <th className="px-5 py-3">📌 Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {interviews.map((item) => (
                <tr
                  key={item._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {item.candidateId?.name}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {item.candidateId?.email}
                  </td>
                  <td className="px-5 py-4 text-gray-800 font-medium">
                    {item.jobId?.title}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {format(new Date(item.scheduledAt), "PPpp")}
                  </td>
                  <td className="px-5 py-4 capitalize">{item.mode}</td>
                  <td className="px-5 py-4 text-gray-700 break-words">
                    {item?.mode === "Online" ? (
                      <a
                        href={item?.locationOrLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-xs bg-green-100 text-green-700 border border-green-300"
                      >
                        Join Meeting
                      </a>
                    ) : (
                      <div className="space-y-1">
                        {item?.locationOrLink && (
                          <div>{item.locationOrLink}</div>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "Scheduled"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        </>

      )}
    </div>
  );
};

export default EmployerShowAllApplication;
