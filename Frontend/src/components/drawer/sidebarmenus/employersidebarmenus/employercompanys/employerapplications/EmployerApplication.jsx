import React, { useEffect, useState } from "react";
import { UseMyCompanyApplications } from "../../../../../../hooks/useApplication.js";
import { FaFilePdf } from "react-icons/fa";
import EmployerApplicationsSkeleton from "../../../../../loading/AppliedJobsSkeleton.jsx";

import ScheduleInterviewForm from "../../employerinterview/ScheduleInterviewForm.jsx";
import Modal from "../../../../../dashboard/Modal.jsx";
import Pagination from "../../../../../shared/pagination/Pagination.jsx";

const EmployerApplication = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setPage(1);
  }, [status, limit]);

  const {
    data: applicationsData,
    isLoading,
    isFetching,
    refetch,
  } = UseMyCompanyApplications({
    page,
    limit,
    ...(status ? { status } : {}),
  });
  const applications = applicationsData?.applications || [];
  const total = applicationsData?.total ?? 0;
  const totalPages = applicationsData?.totalPages ?? 1;


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  if (isLoading) {
    return <EmployerApplicationsSkeleton />;
  }

  const openModal = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedApp(null);
    setIsModalOpen(false);
    refetch(); // refresh data after modal closes
  };

  return (
    <div className="overflow-x-auto bg-white p-6 md:px-5 rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          All Applications
        </h2>
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

      {applications.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No applications submitted yet.
        </div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200  rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-sm font-semibold uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4 text-left">Applicant</th>
              <th className="px-6 py-4 text-left">Job Title</th>
              <th className="px-6 py-4 text-left">Company</th>
              <th className="px-6 py-4 text-left">Applied Date</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Interview Date</th>
              <th className="px-6 py-4 text-left">Action</th>
              <th className="px-6 py-4 text-left">Resume/CV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">
                      {app.applicant.name}
                    </p>
                    <p className="text-xs text-gray-500">{app.applicant.email}</p>
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-800 font-medium">
                  {app.job.title}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {app.job.company.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      app?.interview?.status === "Scheduled"
                        ? "bg-yellow-100 text-yellow-700"
                        : app?.interview?.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : app?.interview?.status === "Cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {app?.interview?.status || "Not Scheduled"}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {app?.interview?.scheduledAt ? (
                    new Date(app.interview?.scheduledAt).toLocaleString()
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      Not scheduled
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => openModal(app)}
                    className="bg-gradient-to-r from-[#7405de] to-[#a626ec] text-white text-xs px-4 py-2 rounded-full transition"
                  >
                    Set Interview
                  </button>
                </td>

                <td className="px-6 py-4">
                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                  >
                    <FaFilePdf className="text-red-500" />
                    <span>View</span>
                  </a>
                </td>
              </tr>
            ))}
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

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedApp?.applicant?._id && selectedApp?.job?._id ? (
          <ScheduleInterviewForm
            candidateId={selectedApp.applicant._id}
            jobId={selectedApp.job._id}
            onSuccess={closeModal}
          />
        ) : (
          <p className="text-sm text-gray-500">Loading form...</p>
        )}
      </Modal>
    </div>
  );
};

export default EmployerApplication;
