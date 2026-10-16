import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";
import {
  UseDeleteSingleCompanyByAdmin,
  UsefetchAllCompanyByAdmin,
  UseUpdateSingleCompanyByAdmin,
} from "../../../../../hooks/useAdmin";
import DashboardManageCompanySkeleton from "../../../../loading/DashboardManageCompanySkeleton.jsx";
import Pagination from "../../../../shared/pagination/Pagination.jsx";
import { FaHandshake, FaTrophy, FaUserFriends } from "react-icons/fa";

const FALLBACK_LOGO = "/defavatar.png";


export const ManageCompany = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    setPage(1);
  }, [search, industry, limit]);

  const { data: Allcompanies, isLoading, isFetching } = UsefetchAllCompanyByAdmin({
    page,
    limit,
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(industry ? { industry } : {}),
  });

  console.log(Allcompanies)



  const companies = Allcompanies?.companies || [];
  const total = Allcompanies?.total ?? 0;
  const totalPages = Allcompanies?.totalPages ?? 1;

  const { mutate: deleteCompany } = UseDeleteSingleCompanyByAdmin();

  const { mutate: updateCompany } = UseUpdateSingleCompanyByAdmin();

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6300B3",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      color: "#333333",
      customClass: {
        popup: "rounded-lg shadow-md",
        confirmButton: "swal2-confirm-btn",
        cancelButton: "swal2-cancel-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCompany(id, {
          onSuccess: () => {
            Swal.fire({
              title: "Deleted!",
              text: "The company has been successfully removed.",
              icon: "success",
              confirmButtonColor: "#6300B3",
              color: "#333333",
            });
          },
          onError: (err) => {
            console.error(err);
            Swal.fire({
              title: "Error",
              text: "Failed to delete the company.",
              icon: "error",
              confirmButtonColor: "#d33",
              color: "#333333",
            });
          },
        });
      }
    });
  };

  const handleBadgeUpdate = (companyId, badgeValue) => {
    updateCompany(
      { id: companyId, badges: badgeValue },
      {
        onSuccess: () => {
          Swal.fire({
            title: "Success!",
            text: `Company promoted as ${badgeValue}.`,
            icon: "success",
            confirmButtonColor: "#6300B3",
          });
        },
        onError: (error) => {
          Swal.fire({
            title: "Error",
            text: "Failed to update badge.",
            icon: "error",
          });
          console.error("Update error:", error);
        },
      }
    );
  };

  if (isLoading)
    return (
      <p>
        <DashboardManageCompanySkeleton />
      </p>
    );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="font-semibold text-r-primary">
          Total Companies : {total}
        </h1>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            aria-label="Search companies"
            placeholder="Search company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-sm input-bordered"
          />
          <select
            aria-label="Filter by industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="select select-sm select-bordered"
          >
            <option value="">All industries</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Software">Software</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Finance & Banking">Finance & Banking</option>
            <option value="others">others</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Name</th>
              <th>Field</th>
              <th>Promotion</th>
              <th>Remove</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1   */}

            {companies?.length > 0 ? (
              <>
                {companies.map((company) => (
                  <tr key={company?._id}>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12  ">
                            <img
                              src={company?.logo || FALLBACK_LOGO}
                              alt={`${company?.name || "Company"} logo`}
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = FALLBACK_LOGO;
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold capitalize">{company?.name}</div>
                          <div className="text-sm opacity-50 capitalize">
                            {company?.location}
                          </div>
                        </div>
                      </div>
                    </td>
          <td className="flex flex-col justify-start items-start space-y-1 p-2">
  <span className="font-semibold text-gray-800 text-sm">
    {company?.industry}
  </span>
  <span className="text-gray-600 text-xs">
    📧 Email: {company?.createdBy?.email}
  </span>
</td>


                    <th>
                      <div className="dropdown dropdown-center">
                        <div tabIndex={0} role="button " className="btn ">
                          {company?.badges === "trusted"
                            ? <>
                              <FaHandshake />
                              <p>Trusted Partner</p>
                            </>
                            : company?.badges === "top-recuiter"
                              ? <>
                                <FaTrophy />
                                <p>Top Recruiter</p>
                              </>
                              : <>
                                <FaUserFriends />
                                <p>Regular Recruiter</p>
                              </>}
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu bg-white w-48 rounded-box z-[1] font-semibold p-2 shadow"
                        >
                          <li>
                            <button
                              onClick={() => handleBadgeUpdate(company?._id, "trusted")}
                              disabled={company?.badges === "trusted"}
                              className={company?.badges === "trusted" ? "text-green-600 font-bold" : ""}
                            >
                              Trusted Partner
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleBadgeUpdate(company._id, "top-recuiter")}
                              disabled={company?.badges === "top-recuiter"}
                              className={company?.badges === "top-recuiter" ? "text-blue-600 font-bold" : ""}
                            >
                              Top Recruiter
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleBadgeUpdate(company?._id, "regular-recuiter")}
                              disabled={company?.badges === "regular-recuiter"}
                              className={company?.badges === "regular-recuiter" ? "text-gray-500 font-bold" : ""}
                            >
                              Regular Recruiter
                            </button>
                          </li>
                        </ul>
                      </div>
                    </th>


                    <th>
                      <button
                        onClick={() => handleDelete(company._id)}
                        className="btn btn-ghost text-xl bg-red-50 text-red-700"
                      >
                        <MdDeleteOutline />
                      </button>
                    </th>
                  </tr>
                ))}
              </>
            ) : (
              "No company Available"
            )}
          </tbody>
        </table>
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
      </div>
    </div>
  );
};
