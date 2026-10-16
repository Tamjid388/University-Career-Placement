import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAllSkillAssessments } from "../../hooks/useSkillAssesment";
import { SkillCard } from "./assessment.ui/SkillCard";
import { Spinner } from "../../components/loading/loader/Spinner";
import { Heading } from "../../components/shared/Heading";
import Pagination from "../../components/shared/pagination/Pagination";

export const SkillSection = () => {
  const { data: skills, isPending } = useAllSkillAssessments();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const allSkills = useMemo(() => skills?.data || [], [skills]);

  const categories = useMemo(
    () => [...new Set(allSkills.map((s) => s.category).filter(Boolean))].sort(),
    [allSkills]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allSkills.filter((s) => {
      const matchesSearch =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q);
      const matchesCategory = !category || s.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [allSkills, search, category]);

  useEffect(() => {
    setPage(1);
  }, [search, category, limit]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * limit, safePage * limit);

  if (isPending) {
    return <Spinner />;
  }
  return (
    <div className="max-w-7xl mx-auto px-4">
      <Heading
        title="Skill Assessment"
        subtitle="Test and evaluate your proficiency in key job-related skills"
      />

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
        <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-sm">
          <Search size={18} className="opacity-60" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="grow"
          />
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered w-full sm:w-auto"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div
        className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3 gap-6
      py-8
    "
      >
        {paged.map((skill) => (
          <SkillCard skill={skill} key={skill._id} />
        ))}
      </div>

      {total === 0 && (
        <p className="text-center text-gray-500 pb-8">
          No skills match your search.
        </p>
      )}

      <div className="pb-10">
        <Pagination
          page={safePage}
          totalPages={totalPages}
          total={total}
          limit={limit}
          limits={[9, 12, 18, 24]}
          onPageChange={setPage}
          onLimitChange={(v) => {
            setLimit(v);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
};
