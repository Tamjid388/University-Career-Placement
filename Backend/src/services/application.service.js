import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import interviewModel from "../models/interview.model.js";
import { sendEmail } from "../utils/mailer.js";
import { getPagination, getSort, buildPageResponse } from "../utils/pagination.js";
import { HttpError } from "../utils/httpError.js";

const APPLICATION_SORTABLE = { createdAt: 1 };

export const attachInterviewsBatched = async (applications) => {
  if (applications.length === 0) return [];
  const jobIds = [...new Set(applications.map((app) => String(app.job?._id || app.job)))];
  const applicantIds = [...new Set(applications.map((app) => String(app.applicant?._id || app.applicant)))];
  const interviews = await interviewModel.find({ jobId: { $in: jobIds }, candidateId: { $in: applicantIds } });
  const interviewMap = new Map(interviews.map((i) => [`${i.jobId}-${i.candidateId}`, i]));
  return applications.map((app) => {
    const appObj = app.toObject();
    const key = `${appObj.job?._id || appObj.job}-${appObj.applicant?._id || appObj.applicant}`;
    return { ...appObj, interview: interviewMap.get(key) || null };
  });
};

export const applyToJob = async (applicantId, { jobId, resume, coverLetter }) => {
  const existing = await Application.findOne({ job: jobId, applicant: applicantId });
  if (existing) throw new HttpError(400, "You have already applied to this job");
  const application = new Application({ job: jobId, applicant: applicantId, resume, coverLetter });
  await application.save();
  return application;
};

export const getApplicationsForJob = async (jobId, query) => {
  const { page, limit, skip } = getPagination(query, 15);
  const sort = getSort(query, APPLICATION_SORTABLE, { createdAt: -1 });
  const filter = { job: jobId };
  if (query.status) filter.status = query.status;
  const [applications, total] = await Promise.all([
    Application.find(filter).sort(sort).skip(skip).limit(limit)
      .populate("applicant", "name email")
      .populate("job", "title image deadline")
      .populate("company", "name logo"),
    Application.countDocuments(filter),
  ]);
  return buildPageResponse({ items: applications, total, page, limit, key: "applications" });
};

export const getAllApplicationsForEmployer = async (employerId, query) => {
  const { page, limit, skip } = getPagination(query, 15);
  const sort = getSort(query, APPLICATION_SORTABLE, { createdAt: -1 });
  const jobs = await Job.find({ postedBy: employerId }).select("_id");
  const jobIds = jobs.map((job) => job._id);
  const filter = { job: { $in: jobIds } };
  if (query.status) filter.status = query.status;
  if (query.jobId && jobIds.some((id) => String(id) === String(query.jobId))) {
    filter.job = query.jobId;
  }
  const [applications, total] = await Promise.all([
    Application.find(filter).sort(sort).skip(skip).limit(limit)
      .populate("applicant", "name email")
      .populate({ path: "job", select: "title image deadline", populate: { path: "company", select: "name logo" } }),
    Application.countDocuments(filter),
  ]);
  const items = await attachInterviewsBatched(applications);
  return buildPageResponse({ items, total, page, limit, key: "applications" });
};

export const getMyApplications = async (applicantId, query) => {
  const { page, limit, skip } = getPagination(query, 15);
  const sort = getSort(query, APPLICATION_SORTABLE, { createdAt: -1 });
  const filter = { applicant: applicantId };
  if (query.status) filter.status = query.status;
  const [applications, total] = await Promise.all([
    Application.find(filter).sort(sort).skip(skip).limit(limit)
      .populate("job")
      .populate("applicant", "name email"),
    Application.countDocuments(filter),
  ]);
  const items = await attachInterviewsBatched(applications);
  return buildPageResponse({ items, total, page, limit, key: "applications" });
};

export const saveApplicationStatus = async (applicationId, status) => {
  const application = await Application.findById(applicationId).populate("applicant", "name email");
  if (!application) throw new HttpError(404, "Application not found");
  application.status = status;
  await application.save();
  try {
    await sendEmail(
      application.applicant.email,
      "Your Application Status Has Been Updated",
      `Hi ${application.applicant.name},\n\nYour application status has been updated to: ${status}.\n\nBest of luck!\nUniversity Job Hub`
    );
  } catch (emailError) {
    console.error("Status saved but notification email failed:", emailError);
  }
  return Application.findById(applicationId).populate("applicant", "name email").populate("job");
};

export const getAllAppliedJobs = async (query) => {
  const { page, limit, skip } = getPagination(query, 20);
  const sort = getSort(query, { createdAt: 1 }, { createdAt: -1 });
  const filter = {};
  if (query.status) filter.status = query.status;
  const [applications, total] = await Promise.all([
    Application.find(filter).sort(sort).skip(skip).limit(limit)
      .populate("applicant", "name email")
      .populate({ path: "job", populate: { path: "company" } }),
    Application.countDocuments(filter),
  ]);
  return buildPageResponse({ items: applications, total, page, limit, key: "applications" });
};
