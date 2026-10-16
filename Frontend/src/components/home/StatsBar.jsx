import { UseJobs } from "../../hooks/useJobs.js";
import { useFetchCompanies } from "../../hooks/useCompany.js";

const StatsBar = () => {
  const { data: jobsData } = UseJobs();
  const { data: companiesData } = useFetchCompanies();

  const jobs = Array.isArray(jobsData?.jobs) ? jobsData.jobs : [];
  const companies = Array.isArray(companiesData?.companies)
    ? companiesData.companies
    : [];
  const jobCount = jobsData?.total ?? jobs.length;
  const companyCount = companiesData?.total ?? companies.length;
  const industries = new Set(
    [...jobs.map((j) => j.industry), ...companies.map((c) => c.industry)].filter(
      Boolean
    )
  );

  const stats = [
    { value: `${jobCount}+`, label: "Active jobs" },
    { value: `${companyCount}+`, label: "Hiring companies" },
    { value: `${industries.size}+`, label: "Industries covered" },
    { value: "100% free", label: "For students" },
  ];

  return (
    <section aria-label="Platform statistics" className="relative z-10 -mt-10 md:-mt-14 bg-transparent">
      <div className="home-container">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-2xl bg-gradient-to-r from-[#7405de] to-[#a626ec] p-6 sm:p-8 text-white shadow-xl ring-1 ring-black/5">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center px-2">
              <dt className="order-2 mt-1 block font-roboto text-xs sm:text-sm text-white/85">
                {stat.label}
              </dt>
              <dd className="order-1 font-poppins text-2xl sm:text-3xl md:text-4xl font-bold">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default StatsBar;
