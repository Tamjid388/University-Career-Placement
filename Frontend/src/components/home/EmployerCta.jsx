import { Link } from "react-router";

const EmployerCta = () => {
  return (
    <section className="home-section bg-base-100">
      <div className="home-container">
        <div className="rounded-2xl bg-gradient-to-r from-purple-700 via-[#7405de] to-[#a626ec] text-white px-6 py-10 sm:p-12 shadow-lg flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="font-poppins text-2xl sm:text-3xl font-bold tracking-tight">
              Hiring? Reach campus talent faster
            </h2>
            <p className="font-roboto mt-2 text-sm sm:text-base text-white/85 max-w-xl mx-auto lg:mx-0">
              Post jobs, shortlist applications, and schedule interviews from one
              employer dashboard.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end shrink-0">
            <Link
              to="/employer-create-company"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Post a job
            </Link>
            <Link
              to="/allcompanies"
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore companies
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployerCta;
