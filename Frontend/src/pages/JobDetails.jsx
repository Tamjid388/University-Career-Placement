import React from "react";
import { useParams } from "react-router";
import { UseFetchSingleJobById } from "../hooks/useJobs.js";

// Components
import HeaderJobCard from "../components/detailsjob/HeaderJobCard.jsx";
import JobDescription from "../components/detailsjob/JobDescription.jsx";
import JobOverView from "../components/detailsjob/JobOverView.jsx";
import CompanyCard from "../components/detailsjob/CompanyCard.jsx";
import RelatedJobs from "../components/detailsjob/RelatedJobs.jsx";
import JobDetailsSkeleton from "../components/loading/JobDetailsSkeleton.jsx";

const JobDetails = () => {
  const { id } = useParams();
  const { data: job, isLoading } = UseFetchSingleJobById(id);
console.log(job);
  if (isLoading) return <JobDetailsSkeleton />;

  return (
    <div className="min-h-screen  pb-20 bg-base-100">
      {/* Job Header */}
      <HeaderJobCard job={job} />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-2 grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Left Content (Description + Related) */}
        <div className="lg:col-span-2 space-y-2">
          <section className=" rounded-xl  p-2">
            <JobDescription job={job} />
          </section>

          <section className=" rounded-xl  p-2">
            <RelatedJobs jobId={id} currentJob={job} />
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-2">
          <div className=" rounded-xl  p-2">
            <JobOverView job={job} />
          </div>

          <div className=" rounded-xl  p-2">
            <CompanyCard job={job} />
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
