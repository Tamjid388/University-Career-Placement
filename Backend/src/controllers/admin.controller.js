import * as adminService from "../services/admin.service.js";
import * as companyService from "../services/company.service.js";
import * as jobService from "../services/job.service.js";
import * as applicationService from "../services/application.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllUsers = catchAsync(async (req, res) => {
  const data = await adminService.getAllUsers(req.query);
  res.status(200).json({ success: true, message: "All users fetched successfully.", ...data });
});

export const deleteUserById = catchAsync(async (req, res) => {
  await adminService.deleteUserById(req.params.id);
  res.status(200).json({ success: true, message: "User deleted successfully." });
});

export const deleteJobByAdmin = catchAsync(async (req, res) => {
  await jobService.deleteJob(req.user, req.params.id);
  res.status(200).json({ success: true, message: "Job deleted successfully" });
});

export const getAllCompanies = catchAsync(async (req, res) => {
  const data = await companyService.getAllCompanies(req.query);
  res.status(200).json(data);
});

export const getCompanyById = catchAsync(async (req, res) => {
  const company = await companyService.getCompanyById(req.params.id);
  res.status(200).json({ success: true, company });
});

export const updateCompanyByAdmin = catchAsync(async (req, res) => {
  const company = await companyService.updateCompany(req.user, req.params.id, req.body, { allowAdmin: true });
  res.status(200).json({ success: true, message: "Company updated successfully.", company });
});

export const deleteCompany = catchAsync(async (req, res) => {
  await companyService.deleteCompany(req.user, req.params.id, { allowAdmin: true });
  res.status(200).json({ success: true, message: "Company and its jobs deleted." });
});

export const getAllAppliedJobs = catchAsync(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
  const data = await applicationService.getAllAppliedJobs(req.query);
  res.status(200).json(data);
});
