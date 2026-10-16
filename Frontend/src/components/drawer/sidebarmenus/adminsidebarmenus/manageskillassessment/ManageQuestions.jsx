import { useEffect, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import Swal from "sweetalert2";
import { useAllSkillAssessments, useDeleteSkill, useUpdateSkill } from "../../../../../hooks/useSkillAssesment";
import { Spinner } from "../../../../loading/loader/Spinner";
import Pagination from "../../../../shared/pagination/Pagination";

const DIFFICULTY_BADGE = {
  Beginner: "badge-success",
  Intermediate: "badge-warning",
  Advanced: "badge-error",
};

const EMPTY_FORM = {
  name: "",
  category: "",
  description: "",
  difficulty: "Beginner",
  icon_url: "",
  is_active: true,
};

export const ManageQuestions = () => {
  const { data: skills, isPending } = useAllSkillAssessments();
  const { mutate: updateSkill, isPending: isUpdating } = useUpdateSkill();
  const { mutate: deleteSkill, isPending: isDeleting } = useDeleteSkill();

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  const allSkills = skills?.data || [];
  const filtered = allSkills.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      s.name?.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setPage(1);
  }, [search, limit]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * limit, safePage * limit);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        category: editing.category || "",
        description: editing.description || "",
        difficulty: editing.difficulty || "Beginner",
        icon_url: editing.icon_url || "",
        is_active: editing.is_active ?? true,
      });
    }
  }, [editing]);

  const closeModal = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.category.trim()) {
      Swal.fire({
        title: "Missing fields",
        text: "Name and category are required.",
        icon: "warning",
      });
      return;
    }
    updateSkill(
      { id: editing._id, data: form },
      {
        onSuccess: () => {
          closeModal();
          Swal.fire({
            title: "Updated!",
            text: "Skill updated successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        },
        onError: (err) => {
          Swal.fire({
            title: "Error",
            text: err?.response?.data?.message || "Failed to update skill.",
            icon: "error",
          });
        },
      }
    );
  };

  const handleToggleActive = (skill) => {
    updateSkill(
      { id: skill._id, data: { is_active: !skill.is_active } },
      {
        onError: (err) => {
          Swal.fire({
            title: "Error",
            text: err?.response?.data?.message || "Failed to update status.",
            icon: "error",
          });
        },
      }
    );
  };

  const handleDelete = (skill) => {
    Swal.fire({
      title: "Delete this skill?",
      html: `<b>${skill.name}</b> and its <b>${skill.assessmentCount ?? 0} assessment(s)</b> will be permanently removed. This cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6300B3",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSkill(skill._id, {
          onSuccess: () => {
            Swal.fire({
              title: "Deleted!",
              text: "The skill has been removed.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          },
          onError: (err) => {
            Swal.fire({
              title: "Error",
              text: err?.response?.data?.message || "Failed to delete skill.",
              icon: "error",
            });
          },
        });
      }
    });
  };

  if (isPending) return <Spinner />;

  return (
    <div>
      {/* Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-sm">
          <Search size={18} className="opacity-60" />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="grow"
          />
        </label>
        <p className="text-sm text-gray-500">
          {total} skill{total === 1 ? "" : "s"}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="table">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th className="text-center">Assessments</th>
              <th className="text-center">Active</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((skill) => (
              <tr key={skill._id} className="hover">
                <td>
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        skill.icon_url ||
                        "https://img.icons8.com/?size=80&id=1EUAqjY63hPZ&format=png"
                      }
                      alt={skill.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold">{skill.name}</p>
                      <p className="text-xs text-gray-500 max-w-55 truncate">
                        {skill.description || "No description"}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-outline">{skill.category}</span>
                </td>
                <td>
                  <span
                    className={`badge ${DIFFICULTY_BADGE[skill.difficulty] || "badge-ghost"}`}
                  >
                    {skill.difficulty}
                  </span>
                </td>
                <td className="text-center">
                  <span className="font-semibold">
                    {skill.assessmentCount ?? 0}
                  </span>
                  <span className="text-xs text-gray-500">
                    {" "}
                    ({skill.questionCount ?? 0} Qs)
                  </span>
                </td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={!!skill.is_active}
                    onChange={() => handleToggleActive(skill)}
                    aria-label={`Toggle ${skill.name} active`}
                  />
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button
                      className="btn btn-sm btn-outline btn-primary"
                      onClick={() => setEditing(skill)}
                      aria-label={`Edit ${skill.name}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error"
                      disabled={isDeleting}
                      onClick={() => handleDelete(skill)}
                      aria-label={`Delete ${skill.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No skills found. Add one from the "Add Skill" tab.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={safePage}
        totalPages={totalPages}
        total={total}
        limit={limit}
        limits={[8, 12, 16, 24]}
        onPageChange={setPage}
        onLimitChange={(v) => {
          setLimit(v);
          setPage(1);
        }}
      />

      {/* Edit modal */}
      {editing && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              Edit Skill — {editing.name}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="font-semibold">Name *</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="font-semibold">Category *</span>
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="font-semibold">Description</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="textarea textarea-bordered w-full"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="font-semibold">Difficulty</span>
                  </label>
                  <select
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm({ ...form, difficulty: e.target.value })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="font-semibold">Icon URL</span>
                  </label>
                  <input
                    type="text"
                    value={form.icon_url}
                    onChange={(e) =>
                      setForm({ ...form, icon_url: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    checked={!!form.is_active}
                    onChange={(e) =>
                      setForm({ ...form, is_active: e.target.checked })
                    }
                    className="checkbox checkbox-primary"
                  />
                  <span className="font-semibold">Is Active?</span>
                </label>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-outline" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={isUpdating}
                onClick={handleSave}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
