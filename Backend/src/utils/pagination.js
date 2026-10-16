export const MAX_LIMIT = 50;

export const getPagination = (query = {}, defaultLimit = 12) => {
  const parsedPage = parseInt(query.page, 10);
  const parsedLimit = parseInt(query.limit, 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const requestedLimit =
    Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : defaultLimit;
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  return { page, limit, skip: (page - 1) * limit };
};

export const getSort = (query = {}, allowed = {}, fallback = { createdAt: -1 }) => {
  const sortBy = query.sortBy;
  if (sortBy && Object.prototype.hasOwnProperty.call(allowed, sortBy)) {
    return { [sortBy]: query.order === "asc" ? 1 : -1 };
  }
  return fallback;
};

export const buildPageResponse = ({ items, total, page, limit, key }) => {
  const safeTotal = Number.isFinite(total) && total >= 0 ? total : 0;
  const totalPages = Math.max(1, Math.ceil(safeTotal / limit));
  return {
    success: true,
    [key]: items,
    total: safeTotal,
    page,
    limit,
    totalPages,
  };
};
