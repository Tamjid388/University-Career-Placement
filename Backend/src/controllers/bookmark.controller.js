import * as bookmarkService from "../services/bookmark.service.js";
import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync.js";

export const toggleBookmark = catchAsync(async (req, res) => {
  const result = await bookmarkService.toggleBookmark(req.user.id, req.body);
  if (result.bookmarked && result.bookmark) {
    return res.status(201).json({ success: true, bookmarked: true, message: "Bookmarked successfully.", bookmark: result.bookmark });
  }
  if (result.bookmarked) {
    return res.status(200).json({ success: true, bookmarked: true, message: "Already bookmarked." });
  }
  return res.status(200).json({ success: true, bookmarked: false, message: "Bookmark removed." });
});

export const getMyBookmarks = catchAsync(async (req, res) => {
  const data = await bookmarkService.getMyBookmarks(req.user.id, req.query);
  return res.status(200).json(data);
});

export const checkBookmark = catchAsync(async (req, res) => {
  const targetType = String(req.query.targetType || "").toLowerCase();
  const targetId = req.query.targetId || req.query.jobId || req.query.companyId;
  if (!["job", "company"].includes(targetType)) {
    return res.status(400).json({ success: false, message: "targetType must be 'job' or 'company'." });
  }
  if (!targetId || !mongoose.isValidObjectId(targetId)) {
    return res.status(400).json({ success: false, message: "A valid targetId is required." });
  }
  const result = await bookmarkService.checkBookmark(req.user.id, { targetType, targetId });
  return res.status(200).json({ success: true, ...result });
});

export const removeBookmark = catchAsync(async (req, res) => {
  await bookmarkService.removeBookmark(req.user.id, req.params.id);
  return res.status(200).json({ success: true, bookmarked: false, message: "Bookmark removed." });
});
