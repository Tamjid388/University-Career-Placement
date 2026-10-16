import React, { useMemo, useState } from "react";
import { useFetchCompanies } from "../../hooks/useCompany.js";
import { UseJobs } from "../../hooks/useJobs.js";
import CompaniesCards from "../company/CompaniesCard.jsx";
import { Link } from "react-router";
import CompanyCardSkeleton from "../loading/SponserCompanyCardSkeleton.jsx";
import { useMediaQuery } from "react-responsive";
import { Heading } from "../shared/Heading";
const SponsorCompany = () => {
  const { data, isLoading, isError } = useFetchCompanies();
  const { data: jobsData } = UseJobs();
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const companies = Array.isArray(data?.companies) ? data.companies : [];

  const openJobsByCompany = useMemo(() => {
    const counts = {};
    const jobs = Array.isArray(jobsData?.jobs) ? jobsData.jobs : [];
    for (const job of jobs) {
      const id =
        typeof job?.company === "string"
          ? job.company
          : job?.company?._id;
      if (id) counts[id] = (counts[id] || 0) + 1;
    }
    return counts;
  }, [jobsData]);

  const industries = [
    "All",
    ...new Set(companies.map((c) => c.industry).filter(Boolean)),
  ];

  const [activeIndustry, setActiveIndustry] = useState("All");

  const filteredCompanies =
    activeIndustry === "All"
      ? companies
      : companies.filter((c) => c.industry === activeIndustry);

  const visibleCompanies = isMobile
    ? filteredCompanies.slice(0, 4)
    : filteredCompanies.slice(0, 8);

  return (
    <section className="home-section bg-base-100">
      <div className="home-container">
        <Heading
          title="Top Companies Hiring"
          subtitle="Top companies actively hiring through our platform"
        />


      {/* Error Message */}
      {isError && (
        <p className="text-center text-red-500 font-medium mb-6">
          Failed to load companies. Please try again later.
        </p>
      )}

      {/* Loading State */}
      {isLoading ? (
        <CompanyCardSkeleton count={8} />
      ) : (
        <>
          {/* Industry Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setActiveIndustry(industry)}
                className={`px-4 py-1.5 border rounded-full text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 ${
                  activeIndustry === industry
                    ? "bg-gradient-to-r from-[#7405de] to-[#a626ec] text-white border-transparent"
                    : "border-base-300 bg-base-100 hover:bg-base-200"
                }`}
              >
                {industry}
              </button>
            ))}
          </div>

          {/* Company Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleCompanies.length > 0 ? (
              visibleCompanies.map((company) => (
                <CompaniesCards
                  key={company._id || company.name}
                  company={company}
                  jobCount={openJobsByCompany[company._id] || 0}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No companies found in this category.
              </p>
            )}
          </div>

          {/* View All Button */}
          <div className="text-center mt-8">
            <Link
              to="/allcompanies"
              className="btn-brand-gradient"
            >
              View All Companies
            </Link>
          </div>
        </>
      )}
      </div>
    </section>
  );
};

export default SponsorCompany;
