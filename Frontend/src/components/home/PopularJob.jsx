import { UseJobs } from "../../hooks/useJobs.js";
import AllJobsSkeleton from "../loading/AllJobsSkeleton.jsx";
import { Heading } from "../shared/Heading";


import JobsCards from "./components/JobsCards.jsx";
import { Link } from "react-router";

const PopularJob = () => {
  const { data, isPending, isError } = UseJobs();
  const jobs = data?.jobs || [];


  if (isPending) return <AllJobsSkeleton />;

  return (
    <section className="home-section bg-base-100">
      <div className="home-container text-center">
        <Heading
          title={"Popular Jobs"}
          subtitle={"Explore the most sought-after job listings in various industries."}
        />

        {isError ? (
          <div className="py-8">
            <p className="text-red-500 font-medium mb-4">
              Failed to load jobs. Please try again later.
            </p>
            <Link className="btn-brand-primary" to="/alljobs">
              Browse all jobs
            </Link>
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-8">
            <p className="card-body-text mb-4">
              No jobs posted yet. Check back soon or browse all listings.
            </p>
            <Link className="btn-brand-primary" to="/alljobs">
              Browse all jobs
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {jobs.slice(0, 6).map((job) => (
                <JobsCards key={job._id} job={job} />
              ))}
            </div>

            <div className="mt-8">
              <Link className="btn-brand-primary" to="/alljobs">
                View all jobs
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PopularJob;
