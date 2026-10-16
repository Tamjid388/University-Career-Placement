import mongoose from "mongoose";
import { Bookmark } from "../models/bookmark.model.js";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { buildPageResponse, getPagination } from "../utils/pagination.js";

const resolveTarget = async (targetType, targetId) => {
  if (targetType === "job") {
    const job = await Job.findById(targetId).select("_id");
    if (!job) {
      return { error: "Job not found." };
    }
    return { job: job._id, company: null };
  }
  const company = await Company.findById(targetId).select("_id");
  if (!company) {
    return { error: "Company not found." };
  }
  return { job: null, company: company._id };
};

export const toggleBookmark = async (req, res) => {
  try {
    const { targetType, targetId } = req.body;

    if (!["job", "company"].includes(targetType)) {
      return res.status(400).json({ success: false, message: "targetType must be 'job' or 'company'." });
    }
    if (!targetId || !mongoose.isValidObjectId(targetId)) {
      return res.status(400).json({ success: false, message: "A valid targetId is required." });
    }

    const resolved = await resolveTarget(targetType, targetId);
    if (resolved.error) {
      return res.status(404).json({ success: false, message: resolved.error });
    }

    const filter =
      targetType === "job"
        ? { user: req.user.id, targetType: "job", job: resolved.job }
        : { user: req.user.id, targetType: "company", company: resolved.company };

    const existing = await Bookmark.findOne(filter);
    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ success: true, bookmarked: false, message: "Bookmark removed." });
    }

    const bookmark = await Bookmark.create({
      user: req.user.id,
      targetType,
      job: resolved.job,
      company: resolved.company,
    });

    return res.status(201).json({ success: true, bookmarked: true, message: "Bookmarked successfully.", bookmark });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(200).json({ success: true, bookmarked: true, message: "Already bookmarked." });
    }
    console.error("Toggle bookmark error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

export const getMyBookmarks = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 12);
    const type = String(req.query.type || "all").toLowerCase();
    const filter = { user: req.user.id };
    if (type === "job" || type === "company") {
      filter.targetType = type;
    }

    const [items, total, jobCount, companyCount] = await Promise.all([
      Bookmark.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: "job", populate: { path: "company", select: "name logo industry location city" } })
        .populate("company"),
      Bookmark.countDocuments(filter),
      Bookmark.countDocuments({ user: req.user.id, targetType: "job" }),
      Bookmark.countDocuments({ user: req.user.id, targetType: "company" }),
    ]);

    // Drop entries whose referenced job/company was deleted
    const bookmarks = items.filter((item) =>
      item.targetType === "job" ? Boolean(item.job) : Boolean(item.company)
    );

    return res.status(200).json({
      ...buildPageResponse({ items: bookmarks, total, page, limit, key: "bookmarks" }),
      counts: { jobs: jobCount, companies: companyCount, total: jobCount + companyCount },
    });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

export const checkBookmark = async (req, res) => {
  try {
    const targetType = String(req.query.targetType || "").toLowerCase();
    const targetId = req.query.targetId || req.query.jobId || req.query.companyId;

    if (!["job", "company"].includes(targetType)) {
      return res.status(400).json({ success: false, message: "targetType must be 'job' or 'company'." });
    }
    if (!targetId || !mongoose.isValidObjectId(targetId)) {
      return res.status(400).json({ success: false, message: "A valid targetId is required." });
    }

    const filter =
      targetType === "job"
        ? { user: req.user.id, targetType: "job", job: targetId }
        : { user: req.user.id, targetType: "company", company: targetId };

    const existing = await Bookmark.findOne(filter).select("_id");
    return res.status(200).json({ success: true, bookmarked: Boolean(existing), bookmarkId: existing?._id || null });
  } catch (error) {
    console.error("Check bookmark error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid bookmark id." });
    }
    const bookmark = await Bookmark.findOne({ _id: id, user: req.user.id });
    if (!bookmark) {
      return res.status(404).json({ success: false, message: "Bookmark not found." });
    }
    await bookmark.deleteOne();
    return res.status(200).json({ success: true, bookmarked: false, message: "Bookmark removed." });
  } catch (error) {
    console.error("Remove bookmark error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};
