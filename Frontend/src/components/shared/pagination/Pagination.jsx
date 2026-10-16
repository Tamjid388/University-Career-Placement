const getPageItems = (page, totalPages, siblingCount) => {
  const siblings = Math.max(0, siblingCount);
  const pages = new Set([1, totalPages, page]);
  for (let i = 1; i <= siblings; i += 1) {
    if (page - i > 1) pages.add(page - i);
    if (page + i < totalPages) pages.add(page + i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const items = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) {
      items.push("ellipsis");
    }
    items.push(p);
  });
  return items;
};

export const Pagination = ({
  page,
  totalPages,
  total,
  limit,
  limits = [9, 12, 20, 50],
  onPageChange,
  onLimitChange,
  siblingCount = 1,
  isLoading = false,
}) => {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeTotalPages = Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1;
  if (safeTotalPages < 2 && total == null) return null;

  const items = getPageItems(safePage, safeTotalPages, siblingCount);
  const start = total != null && limit != null ? (safePage - 1) * limit + 1 : null;
  const end = total != null && limit != null ? Math.min(safePage * limit, total) : null;

  return (
    <nav aria-label="Pagination" className="mt-6 flex flex-col items-center gap-3">
      {total != null && start != null && (
        <p className="text-sm text-gray-500">
          Showing {total === 0 ? 0 : start}&ndash;{end} of {total}
        </p>
      )}
      {safeTotalPages > 1 && (
        <div className="join">
          <button
            type="button"
            aria-label="Previous page"
            aria-disabled={safePage === 1 || isLoading}
            disabled={safePage === 1 || isLoading}
            onClick={() => onPageChange?.(safePage - 1)}
            className="btn join-item"
          >
            Prev
          </button>
          {items.map((item, index) =>
            item === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className="btn join-item btn-disabled" aria-hidden="true">
                &hellip;
              </span>
            ) : (
              <button
                key={item}
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === safePage ? "page" : undefined}
                disabled={isLoading}
                onClick={() => onPageChange?.(item)}
                className={`btn join-item ${item === safePage ? "bg-purple-600 text-white" : ""}`}
              >
                {item}
              </button>
            )
          )}
          <button
            type="button"
            aria-label="Next page"
            aria-disabled={safePage === safeTotalPages || isLoading}
            disabled={safePage === safeTotalPages || isLoading}
            onClick={() => onPageChange?.(safePage + 1)}
            className="btn join-item"
          >
            Next
          </button>
        </div>
      )}
      {onLimitChange && limit != null && (
        <label className="flex items-center gap-2 text-sm text-gray-500">
          Per page
          <select
            aria-label="Items per page"
            value={limit}
            disabled={isLoading}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="select select-sm select-bordered"
          >
            {limits.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      )}
    </nav>
  );
};

export default Pagination;
