import { useEffect, useState } from "react";
import { useFetchCompanies } from "../../hooks/useCompany.js";

import CardCompanySkeleton from "../../components/loading/CardCompanySkeleton.jsx";
import CompanyCard from "../../components/company/CompanyCard.jsx";
import Pagination from "../../components/shared/pagination/Pagination.jsx";

const COMPANY_PER_PAGE = 9;

const AllCompany = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(COMPANY_PER_PAGE);
  const [sortValue, setSortValue] = useState("createdAt:desc");

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    industry: "",
  });

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [filters, sortValue, limit]);

  const [sortBy, order] = sortValue.split(":");
  const { data, isLoading, isError } = useFetchCompanies({
    page,
    limit,
    sortBy,
    order,
    ...(filters.keyword.trim() ? { search: filters.keyword.trim() } : {}),
    ...(filters.location.trim() ? { location: filters.location.trim() } : {}),
    ...(filters.industry ? { industry: filters.industry } : {}),
  });

  const companies = data?.companies || [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handlePageChange = (next) => {
    setPage(next);
  };

  const industries = [
    "Information Technology",
    "Healthcare",
    "Education",
    "Finance & Banking",
    "Manufacturing",
    "Construction",
    "Transportation & Logistics",
    "Retail & E-commerce",
    "Telecommunications",
    "Media & Entertainment",
    "Energy & Utilities",
    "Agriculture",
    "Real Estate",
    "Government & Public Sector",
    "Hospitality & Tourism",
    "Legal Services",
    "Non-Profit / NGOs",
    "Aerospace & Defense",
    "Automotive",
    "Biotechnology & Pharmaceuticals",
    "Software",
    "others",
  ];

  if (isError) return <p className="text-red-600 text-center mt-10">Something went wrong: {isError.message}</p>;

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="container mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Filter Sidebar */}
        <aside className=" p-5 rounded-lg shadow-sm space-y-6    overflow-y-auto">
          {/* Keyword Filter */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Search by Keywords
            </label>
            <input
              type="text"
              placeholder="Company name..."
              className="w-full border p-2 rounded input "
              value={filters.keyword}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, keyword: e.target.value }))
              }
            />
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-semibold mb-1">Location</label>
            <input
              type="text"
              placeholder="City or location"
              className="w-full border p-2 rounded input "
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, location: e.target.value }))
              }
            />
          </div>

          {/* Industry Filter */}
          <div>
            <label className="block text-sm font-semibold mb-1">Industry</label>
            <select
              className="w-full border p-2 rounded select"
              value={filters.industry}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, industry: e.target.value }))
              }
            >
              <option value="">Choose an industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-semibold mb-1">Sort by</label>
            <select
              className="w-full border p-2 rounded select"
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
            >
              <option value="createdAt:desc">Newest first</option>
              <option value="createdAt:asc">Oldest first</option>
              <option value="name:asc">Name A–Z</option>
            </select>
          </div>
        </aside>

        {/* Company Cards Section */}
        <div className="bg-white lg:col-span-2 px-4 space-y-3">
          {isLoading ? (
            <CardCompanySkeleton count={limit} />
          ) : (
            <>
              <CompanyCard companies={companies} />
              {companies.length === 0 && (
                <div className="text-center py-10 text-gray-500 font-semibold">
                  No companies found matching your filters.
                </div>
              )}
            </>
          )}

          {!isLoading && !isError && (
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCompany;
