import { Application } from "../models/application.model.js";
import interviewModel from "../models/interview.model.js";
import { getPagination, getSort, buildPageResponse } from "../utils/pagination.js";
import { HttpError } from "../utils/httpError.js";

export const scheduleInterview = async (employerId, data) => {
  const interview = await interviewModel.create({ ...data, employerId });
  await Application.findOneAndUpdate(
    { job: data.jobId, applicant: data.candidateId },
    { status: "Scheduled" }
  );
  return interview;
};

export const getEmployerInterviews = async (employerId, query) => {
  const { page, limit, skip } = getPagination(query, 15);
  const sort = getSort(query, { scheduledAt: 1, createdAt: 1 }, { scheduledAt: -1 });
  const filter = { employerId };
  if (query.status) filter.status = query.status;
  const [interviews, total] = await Promise.all([
    interviewModel.find(filter).sort(sort).skip(skip).limit(limit)
      .populate("candidateId", "name email")
      .populate("jobId", "title"),
    interviewModel.countDocuments(filter),
  ]);
  return buildPageResponse({ items: interviews, total, page, limit, key: "interviews" });
};

export const updateInterviewStatus = async (id, status) => {
  const interview = await interviewModel.findByIdAndUpdate(id, { status }, { new: true });
  if (!interview) throw new HttpError(404, "Interview not found");
  return interview;
};
