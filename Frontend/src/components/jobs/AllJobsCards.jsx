import { UseJobs } from "../../hooks/useJobs.js";

import { useState } from "react";
import AllJobsSkeleton from "../loading/AllJobsSkeleton.jsx";
import SingleJobCard from "./SingleJobCard.jsx";
import Pagination from "../shared/pagination/Pagination.jsx";

const JOBS_PER_PAGE = 4;
const AllJobsCards = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(JOBS_PER_PAGE);
  const { data, isPending, error, isFetching } = UseJobs({ page, limit });
  const [activeJobId, setActiveJobId] = useState(null);
  const jobs = data?.jobs || [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleApply = (applicationData) => {
    console.log("Application submitted", applicationData);
    setActiveJobId(null);
  };

  const handlePageChange = (next) => {
    setPage(next);
    setActiveJobId(null); // reset modal when page changes
  };

  if (isPending) return <AllJobsSkeleton />;
  if (error) return <div>Something went wrong loading jobs!</div>;

  return (
    <div className="space-y-4">
      {/* Job Cards */}
      {jobs.map((job) => (
        <SingleJobCard
          key={job._id}
          job={job}
          setActiveJobId={setActiveJobId}
          activeJobId={activeJobId}
          handleApply={handleApply}
        ></SingleJobCard>
      ))}

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
    </div>
  );
};

export default AllJobsCards;
