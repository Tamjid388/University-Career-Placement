import mongoose from "mongoose";
import { Bookmark } from "../models/bookmark.model.js";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { getPagination, buildPageResponse } from "../utils/pagination.js";
import { HttpError } from "../utils/httpError.js";

export const resolveTarget = async (targetType, targetId) => {
  if (targetType === "job") {
    const job = await Job.findById(targetId).select("_id");
    if (!job) throw new HttpError(404, "Job not found.");
    return { job: job._id, company: null };
  }
  const company = await Company.findById(targetId).select("_id");
  if (!company) throw new HttpError(404, "Company not found.");
  return { job: null, company: company._id };
};

export const toggleBookmark = async (userId, { targetType, targetId }) => {
  const resolved = await resolveTarget(targetType, targetId);
  const filter = targetType === "job"
    ? { user: userId, targetType: "job", job: resolved.job }
    : { user: userId, targetType: "company", company: resolved.company };
  const existing = await Bookmark.findOne(filter);
  if (existing) {
    await existing.deleteOne();
    return { bookmarked: false };
  }
  try {
    const bookmark = await Bookmark.create({ user: userId, targetType, job: resolved.job, company: resolved.company });
    return { bookmarked: true, bookmark };
  } catch (error) {
    if (error?.code === 11000) return { bookmarked: true };
    throw error;
  }
};

export const getMyBookmarks = async (userId, query) => {
  const { page, limit, skip } = getPagination(query, 12);
  const type = String(query.type || "all").toLowerCase();
  const filter = { user: userId };
  if (type === "job" || type === "company") filter.targetType = type;
  const [items, total, jobCount, companyCount] = await Promise.all([
    Bookmark.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate({ path: "job", populate: { path: "company", select: "name logo industry location city" } })
      .populate("company"),
    Bookmark.countDocuments(filter),
    Bookmark.countDocuments({ user: userId, targetType: "job" }),
    Bookmark.countDocuments({ user: userId, targetType: "company" }),
  ]);
  const bookmarks = items.filter((item) => (item.targetType === "job" ? Boolean(item.job) : Boolean(item.company)));
  return {
    ...buildPageResponse({ items: bookmarks, total, page, limit, key: "bookmarks" }),
    counts: { jobs: jobCount, companies: companyCount, total: jobCount + companyCount },
  };
};

export const checkBookmark = async (userId, { targetType, targetId }) => {
  const filter = targetType === "job"
    ? { user: userId, targetType: "job", job: targetId }
    : { user: userId, targetType: "company", company: targetId };
  const existing = await Bookmark.findOne(filter).select("_id");
  return { bookmarked: Boolean(existing), bookmarkId: existing?._id || null };
};

export const removeBookmark = async (userId, id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid bookmark id.");
  const bookmark = await Bookmark.findOne({ _id: id, user: userId });
  if (!bookmark) throw new HttpError(404, "Bookmark not found.");
  await bookmark.deleteOne();
  return true;
};
