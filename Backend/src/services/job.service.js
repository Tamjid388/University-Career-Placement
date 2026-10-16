import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { getPagination, getSort, buildPageResponse } from "../utils/pagination.js";
import { HttpError } from "../utils/httpError.js";

const JOB_SORTABLE = { createdAt: 1, title: 1, deadline: 1 };

export const buildJobFilter = async (params = {}, base = {}) => {
  const filter = { ...base };
  const { title, jobTitle, companyName, jobType, industry, location, city, country, skills, salaryMin, salaryMax } = params;
  const titleValue = title || jobTitle;
  if (titleValue) filter.title = { $regex: titleValue, $options: "i" };
  if (jobType) filter.jobType = jobType;
  if (industry) filter.industry = industry;
  const locationValue = location || city || country;
  if (locationValue) {
    const regex = { $regex: locationValue, $options: "i" };
    filter.$or = [...(filter.$or || []), { location: regex }, { city: regex }, { country: regex }];
  }
  if (skills) {
    const skillsArray = String(skills).split(",").map((s) => s.trim()).filter(Boolean);
    if (skillsArray.length > 0) filter.skillsRequired = { $all: skillsArray };
  }
  const min = Number(salaryMin);
  if (Number.isFinite(min) && salaryMin !== undefined && salaryMin !== "") {
    filter["salaryRange.min"] = { $gte: min };
  }
  const max = Number(salaryMax);
  if (Number.isFinite(max) && salaryMax !== undefined && salaryMax !== "") {
    filter["salaryRange.max"] = { $lte: max };
  }
  if (companyName) {
    const companies = await Company.find({ name: { $regex: companyName, $options: "i" } }).select("_id");
    filter.company = { $in: companies.map((c) => c._id) };
  }
  return filter;
};

const JOB_ALLOWED_UPDATES = [
  "title", "description", "industry", "location", "salaryRange", "city", "country",
  "jobType", "deadline", "skillsRequired", "image", "vacancy", "salaryType", "currency",
  "jobLevel", "jobShift", "gender", "minEducationLevel", "preferredEducationLevel",
  "totalExperience", "minExperience", "maxExperience", "minAge", "maxAge", "jobRequirements",
];

export const createJob = async (employerId, data) => {
  const companyExists = await Company.findOne({ _id: data.company, createdBy: employerId });
  if (!companyExists) throw new HttpError(403, "You do not own this company.");
  const job = new Job({ ...data, postedBy: employerId, status: "pending" });
  await job.save();
  return job;
};

export const getAllJobs = async (query) => {
  const { page, limit, skip } = getPagination(query, 12);
  const sort = getSort(query, JOB_SORTABLE, { createdAt: -1 });
  const filter = await buildJobFilter(query, { status: "approved" });
  const [jobs, total] = await Promise.all([
    Job.find(filter).sort(sort).skip(skip).limit(limit).populate("company").populate("postedBy", "email"),
    Job.countDocuments(filter),
  ]);
  return buildPageResponse({ items: jobs, total, page, limit, key: "jobs" });
};

export const getJobById = async (id) => {
  const job = await Job.findById(id).populate("company").populate("postedBy", "email");
  if (!job) throw new HttpError(404, "Job not found");
  return job;
};

export const updateJob = async (userId, id, data) => {
  const job = await Job.findById(id);
  if (!job) throw new HttpError(404, "Job not found");
  if (job.postedBy.toString() !== userId) {
    throw new HttpError(403, "Not authorized to update this job");
  }
  JOB_ALLOWED_UPDATES.forEach((field) => {
    if (data[field] !== undefined) job[field] = data[field];
  });
  await job.save();
  return job;
};

export const deleteJob = async (user, id) => {
  const job = await Job.findById(id);
  if (!job) throw new HttpError(404, "Job not found");
  const isOwner = job.postedBy.toString() === user.id;
  if (!isOwner && user.role !== "admin") {
    throw new HttpError(403, "Not authorized to delete this job");
  }
  await job.deleteOne();
  return true;
};

export const searchJobs = async (query) => {
  const { page, limit, skip } = getPagination(query, 12);
  const sort = getSort(query, JOB_SORTABLE, { createdAt: -1 });
  const filter = await buildJobFilter(query, { status: "approved" });
  const [jobs, total] = await Promise.all([
    Job.find(filter).sort(sort).skip(skip).limit(limit).populate("company", "name logo").populate("postedBy", "email"),
    Job.countDocuments(filter),
  ]);
  return buildPageResponse({ items: jobs, total, page, limit, key: "jobs" });
};

export const getRecommendedJobs = async (jobId) => {
  const currentJob = await Job.findById(jobId).populate("company");
  if (!currentJob) throw new HttpError(404, "Job not found");
  const titleKeywords = currentJob.title.split(" ").slice(0, 2).join(" ");
  return Job.find({
    _id: { $ne: jobId },
    $or: [
      { company: currentJob.company._id },
      { title: { $regex: titleKeywords, $options: "i" } },
      { industry: currentJob.industry || { $exists: false } },
    ],
  }).limit(5).sort({ createdAt: -1 }).populate("company").populate("postedBy", "email");
};

export const getMyJobs = async (userId, query) => {
  const { page, limit, skip } = getPagination(query, 12);
  const sort = getSort(query, JOB_SORTABLE, { createdAt: -1 });
  const filter = { postedBy: userId };
  if (query.status) filter.status = query.status;
  const [jobs, total] = await Promise.all([
    Job.find(filter).sort(sort).skip(skip).limit(limit).populate("company", "name logo").populate("postedBy", "email"),
    Job.countDocuments(filter),
  ]);
  return buildPageResponse({ items: jobs, total, page, limit, key: "jobs" });
};

export const getAllJobsForAdmin = async (query) => {
  const { page, limit, skip } = getPagination(query, 20);
  const sort = getSort(query, { createdAt: 1, title: 1 }, { createdAt: -1 });
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.jobType) filter.jobType = query.jobType;
  if (query.title) filter.title = { $regex: query.title, $options: "i" };
  const [jobs, total] = await Promise.all([
    Job.find(filter).sort(sort).skip(skip).limit(limit),
    Job.countDocuments(filter),
  ]);
  return buildPageResponse({ items: jobs, total, page, limit, key: "jobs" });
};

export const updateJobStatus = async (id, status) => {
  if (!status) throw new HttpError(400, "Invalid status");
  if (!id) throw new HttpError(400, "Invalid Post Id");
  const updatedJob = await Job.findByIdAndUpdate(id, { status }, { new: true });
  if (!updatedJob) throw new HttpError(404, "Job not found");
  return updatedJob;
};
