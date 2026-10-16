import * as resumeService from "../services/resumebuilder.service.js";
import { catchAsync } from "../utils/catchAsync.js";

const createResume = catchAsync(async (req, res) => {
  const { resume, created } = await resumeService.createOrUpdateResume(req.body);
  if (created) {
    return res.status(201).json({ success: true, message: "Resume created successfully", data: resume });
  }
  return res.status(200).json({ success: true, message: "Resume updated successfully", data: resume });
});

export const getUserResumes = catchAsync(async (req, res) => {
  const resumes = await resumeService.getUserResume(req.params.userId);
  res.status(200).json({ success: true, count: resumes?.length ?? 0, data: resumes });
});

export const deleteResume = catchAsync(async (req, res) => {
  await resumeService.deleteResume(req.params.id);
  res.status(200).json({ success: true, message: "Resume deleted successfully" });
});

export const resumebuilderController = { createResume, getUserResumes, deleteResume };
