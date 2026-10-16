import * as companyService from "../services/company.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createCompany = catchAsync(async (req, res) => {
  const company = await companyService.createCompany(req.user, req.body);
  return res.status(201).json({ success: true, message: "Company profile created successfully", company });
});

export const getAllCompanies = catchAsync(async (req, res) => {
  const data = await companyService.getAllCompanies(req.query);
  res.status(200).json({ success: true, ...data });
});

export const getCompanyById = catchAsync(async (req, res) => {
  const company = await companyService.getCompanyById(req.params.id);
  res.status(200).json({ success: true, company });
});

export const updateCompany = catchAsync(async (req, res) => {
  const company = await companyService.updateCompany(req.user, req.params.id, req.body);
  res.status(200).json({ success: true, message: "Company updated successfully.", company });
});

export const deleteCompany = catchAsync(async (req, res) => {
  await companyService.deleteCompany(req.user, req.params.id);
  res.status(200).json({ success: true, message: "Company deleted." });
});

export const getMyCompany = catchAsync(async (req, res) => {
  const company = await companyService.getMyCompanies(req.user);
  res.status(200).json({ success: true, company });
});
