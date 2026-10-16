import * as applicationService from "../services/application.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const applyToJob = catchAsync(async (req, res) => {
  await applicationService.applyToJob(req.user.id, req.body);
  res.status(201).json({ success: true, message: "Application submitted successfully." });
});

export const getApplicationsForJob = catchAsync(async (req, res) => {
  const data = await applicationService.getApplicationsForJob(req.params.jobId, req.query);
  res.status(200).json(data);
});

export const getAllApplicationsForEmployer = catchAsync(async (req, res) => {
  const data = await applicationService.getAllApplicationsForEmployer(req.user.id, req.query);
  res.status(200).json(data);
});

export const getMyApplications = catchAsync(async (req, res) => {
  const data = await applicationService.getMyApplications(req.user.id, req.query);
  res.status(200).json(data);
});

export const updateApplicationStatus = catchAsync(async (req, res) => {
  const application = await applicationService.saveApplicationStatus(req.params.applicationId, req.body.status);
  res.status(200).json({ success: true, application });
});
