import { User } from "../models/user.model.js";
import { getPagination, getSort, buildPageResponse } from "../utils/pagination.js";
import { HttpError } from "../utils/httpError.js";

export const getAllUsers = async (query) => {
  const { page, limit, skip } = getPagination(query, 20);
  const sort = getSort(query, { createdAt: 1, name: 1 }, { createdAt: -1 });
  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.search) {
    const regex = { $regex: query.search, $options: "i" };
    filter.$or = [{ name: regex }, { email: regex }];
  }
  const [users, total] = await Promise.all([
    User.find(filter).select("name email role isProfileComplete createdAt").sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  return buildPageResponse({ items: users, total, page, limit, key: "users" });
};

export const deleteUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new HttpError(404, "User not found.");
  await user.deleteOne();
  return true;
};
