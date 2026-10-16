import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { UseAdminAllUser, UseAdminDeleteUser } from '../../../../../hooks/useAdmin'
import Swal from "sweetalert2";
import { Spinner } from "../../../../loading/loader/Spinner";
import DashboardManageCompanySkeleton from "../../../../loading/DashboardManageCompanySkeleton";
import Pagination from "../../../../shared/pagination/Pagination.jsx";

export const ManageUsers = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPage(1);
  }, [role, search, limit]);

  const { data: allUsers, isPending, isFetching } = UseAdminAllUser({
    page,
    limit,
    ...(role ? { role } : {}),
    ...(search.trim() ? { search: search.trim() } : {}),
  });
  const { mutate: deleteUser } = UseAdminDeleteUser()

  const users = allUsers?.users || [];
  const total = allUsers?.total ?? 0;
  const totalPages = allUsers?.totalPages ?? 1;
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#A78BFA',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'The user has been removed.',
          icon: 'success',
          confirmButtonColor: '#6B21A8',
        });
      }
    });
  };



  if (isPending) {
    return <DashboardManageCompanySkeleton />;
  }

  return (
    <div className="p-4 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-2xl font-semibold">Manage Users</h2>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            aria-label="Search users"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-sm input-bordered"
          />
          <select
            aria-label="Filter by role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="select select-sm select-bordered"
          >
            <option value="">All roles</option>
            <option value="job-seeker">job-seeker</option>
            <option value="employer">employer</option>
            <option value="admin">admin</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Sl.</th>
              <th>Name & Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <th>{(page - 1) * limit + index + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={`https://api.dicebear.com/9.x/personas/svg?seed=${user.name}`}
                          alt="Avatar"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-sm opacity-50">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {/* <button className="btn btn-sm  mr-2">Edit</button> */}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="btn btn-sm text-red-600">
                    <RiDeleteBin6Line />
                  </button>
                </td>
              </tr>
            ))}
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
