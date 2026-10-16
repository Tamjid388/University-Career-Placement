import React from "react";
import { Link } from "react-router";

const CompaniesCards = ({ company, jobCount }) => {
  const locationParts = [company?.city, company?.location, company?.country]
    .filter((p) => typeof p === "string" && p.trim())
    .filter((p, i, arr) => arr.indexOf(p) === i);
  const locationText =
    locationParts.length > 0 ? locationParts.join(", ") : "Location not listed";
  return (
   <div className="home-card h-full">
    <Link to={`/companydetails/${company._id}`}>
     <div className="p-5 space-y-3">
      {/* Logo & Name */}
      <div className="flex items-center gap-4 min-w-0">
        <img
          src={company.logo || "/fallback-logo.png"}
          alt={`${company.name} logo`}
          loading="lazy"
          className="w-14 h-14 rounded object-contain shrink-0 bg-base-200"
          onError={(e) => (e.target.src = "/fallback-logo.png")} // fallback
        />
        <div className="min-w-0">
          <h3 className="card-title truncate">{company.name}</h3>
          <p className="card-body-text capitalize truncate">{locationText}</p>
        </div>
      </div>

      {/* Industry + open roles */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="home-chip">
          {company.industry}
        </span>
        {typeof jobCount === "number" && jobCount > 0 && (
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            {jobCount} open role{jobCount === 1 ? "" : "s"}
          </span>
        )}
      </div>

      

      {/* Badges & Trusted */}
      <div className="flex items-center justify-between text-sm mt-2">
        <span className="text-gray-500 dark:text-gray-400 capitalize">
          Badge:{" "}
          <strong className="text-gray-700 dark:text-gray-200">{company.badges || "None"}</strong>
        </span>
   
      </div>
    </div>
    </Link>
   </div>
  );
};

export default CompaniesCards;
