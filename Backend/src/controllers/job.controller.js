import * as jobService from "../services/job.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createJob = catchAsync(async (req, res) => {
  const job = await jobService.createJob(req.user.id, req.body);
  res.status(201).json({ success: true, message: "Job created successfully", job });
});

export const getAllJobs = catchAsync(async (req, res) => {
  const data = await jobService.getAllJobs(req.query);
  res.status(200).json(data);
});

export const getJobById = catchAsync(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  res.status(200).json({ success: true, job });
});

export const updateJob = catchAsync(async (req, res) => {
  const job = await jobService.updateJob(req.user.id, req.params.id, req.body);
  res.status(200).json({ success: true, message: "Job updated successfully", job });
});

export const deleteJob = catchAsync(async (req, res) => {
  await jobService.deleteJob(req.user, req.params.id);
  res.status(200).json({ success: true, message: "Job deleted successfully" });
});

export const searchJobs = catchAsync(async (req, res) => {
  const data = await jobService.searchJobs(req.query);
  res.status(200).json(data);
});

export const getRecommendedJobs = catchAsync(async (req, res) => {
  const recommendedJobs = await jobService.getRecommendedJobs(req.params.jobId);
  res.status(200).json({ success: true, data: recommendedJobs });
});

export const getMyJobs = catchAsync(async (req, res) => {
  const data = await jobService.getMyJobs(req.user.id, req.query);
  res.status(200).json(data);
});

export const getAllJobsForAdmin = catchAsync(async (req, res) => {
  try {
    const data = await jobService.getAllJobsForAdmin(req.query);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed To fetch Jobs" });
  }
});

export const updateJobStatus = catchAsync(async (req, res) => {
  try {
    const job = await jobService.updateJobStatus(req.params.id, req.body.status);
    return res.status(200).json({ message: "Status Changed Successfully", job });
  } catch (error) {
    if (error?.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Status Change Failed" });
  }
});
