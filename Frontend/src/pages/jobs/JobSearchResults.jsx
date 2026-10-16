import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { UseSearchJobs } from "../../hooks/useJobs.js";
import JobsCards from "../../components/home/components/JobsCards.jsx";
import AllJobsSkeleton from "../../components/loading/AllJobsSkeleton.jsx";
import Pagination from "../../components/shared/pagination/Pagination.jsx";
import { Heading } from "../../components/shared/Heading";

const SEARCH_PER_PAGE = 12;

const JobSearchResults = () => {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title")?.trim() ?? "";
  const location = searchParams.get("location")?.trim() ?? "";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(SEARCH_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [title, location, limit]);

  const { data, isPending, isError, isFetching } = UseSearchJobs({
    page,
    limit,
    ...(title ? { title } : {}),
    ...(location ? { location } : {}),
  });
  const jobs = data?.jobs || [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const summary = [title && `"${title}"`, location && `in ${location}`]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="home-section bg-base-100">
      <div className="home-container">
        <Heading
          title={summary ? `Results for ${summary}` : "Search jobs"}
          subtitle={
            isPending
              ? "Searching..."
              : `${total} job${total === 1 ? "" : "s"} found`
          }
        />

        {isPending ? (
          <AllJobsSkeleton />
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-500 font-medium mb-4">
              Search failed. Please try again.
            </p>
            <Link to="/alljobs" className="btn-brand-primary">
              Browse all jobs
            </Link>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="card-body-text mb-4">
              No jobs match your search. Try a different keyword or location.
            </p>
            <Link to="/alljobs" className="btn-brand-primary">
              Browse all jobs
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobsCards key={job._id} job={job} />
              ))}
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
            <div className="text-center mt-8">
              <Link to="/alljobs" className="btn-brand-secondary">
                Browse all jobs
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default JobSearchResults;
