import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { getPagination, getSort, buildPageResponse } from "../utils/pagination.js";
import { HttpError } from "../utils/httpError.js";

const COMPANY_SORTABLE = { createdAt: 1, name: 1 };

export const createCompany = async (user, data) => {
  if (!user?.id) throw new HttpError(401, "Unauthorized");
  if (user.role !== "employer") {
    throw new HttpError(403, "Only employers can create a company profile");
  }
  const company = new Company({ ...data, createdBy: user.id });
  await company.save();
  return company;
};

export const getAllCompanies = async (query) => {
  const { page, limit, skip } = getPagination(query, 9);
  const sort = getSort(query, COMPANY_SORTABLE, { createdAt: -1 });
  const filter = {};
  if (query.industry) filter.industry = query.industry;
  if (query.search || query.keyword) {
    filter.name = { $regex: query.search || query.keyword, $options: "i" };
  }
  if (query.location) {
    const regex = { $regex: query.location, $options: "i" };
    filter.$or = [{ location: regex }, { city: regex }, { country: regex }];
  }
  const [companies, total] = await Promise.all([
    Company.find(filter).sort(sort).skip(skip).limit(limit).populate("createdBy", "name email"),
    Company.countDocuments(filter),
  ]);
  const pageIds = companies.map((c) => c._id);
  const jobCounts = pageIds.length > 0
    ? await Job.aggregate([
      { $match: { company: { $in: pageIds } } },
      { $group: { _id: "$company", openings: { $sum: 1 } } },
    ])
    : [];
  const jobCountMap = {};
  jobCounts.forEach((j) => { jobCountMap[j._id.toString()] = j.openings; });
  const results = companies.map((company) => ({
    ...company._doc,
    openings: jobCountMap[company._id.toString()] || 0,
  }));
  return buildPageResponse({ items: results, total, page, limit, key: "companies" });
};

export const getCompanyById = async (id) => {
  const company = await Company.findById(id).populate("createdBy", "name email");
  if (!company) throw new HttpError(404, "Company not found.");
  return company;
};

const COMPANY_ALLOWED_UPDATES = [
  "name", "location", "industry", "websiteUrl", "logo", "city", "description",
  "establishment", "employees", "country", "contactPersonName", "contactPersonDesignation",
  "contactPersonEmail", "contactPersonMobile", "facebookUrl", "twitterUrl",
  "linkedinUrl", "cover", "trusted", "badges",
  // legacy mis-cased keys still accepted from existing clients
  "websiteurl", "Contact_Person_Name", "Contact_Person_Designation",
  "Contact_Person_email", "Contact_Person_mobile", "facebookurl", "twittweurl", "linkdinurl",
];

export const updateCompany = async (user, id, data, { allowAdmin = false } = {}) => {
  const company = await Company.findById(id);
  if (!company) throw new HttpError(404, "Company not found.");
  const isCreator = company.createdBy.toString() === user.id;
  const isAdmin = user.role === "admin";
  if (allowAdmin ? !(isAdmin || isCreator) : !isCreator) {
    throw new HttpError(403, "Not authorized to update this company.");
  }
  COMPANY_ALLOWED_UPDATES.forEach((field) => {
    if (data[field] !== undefined) company[field] = data[field];
  });
  await company.save();
  return company;
};

export const deleteCompany = async (user, id, { allowAdmin = false } = {}) => {
  const company = await Company.findById(id);
  if (!company) throw new HttpError(404, "Company not found.");
  const isOwner = company.createdBy.equals(user.id);
  const isAdmin = user.role === "admin";
  if (allowAdmin ? !(isOwner || isAdmin) : !isOwner) {
    throw new HttpError(403, "Not authorized.");
  }
  await company.deleteOne();
  return true;
};

export const getMyCompanies = async (user) => {
  if (!user?.id) throw new HttpError(401, "Unauthorized");
  if (user.role !== "employer") {
    throw new HttpError(403, "Only employers can view their company profile");
  }
  return Company.find({ createdBy: user.id });
};
