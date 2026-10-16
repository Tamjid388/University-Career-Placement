import * as interviewService from "../services/interview.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const scheduleInterview = catchAsync(async (req, res) => {
  const interview = await interviewService.scheduleInterview(req.user.id, req.body);
  res.status(201).json({ success: true, interview });
});

export const getEmployerInterviews = catchAsync(async (req, res) => {
  const data = await interviewService.getEmployerInterviews(req.user.id, req.query);
  res.status(200).json(data);
});

export const updateInterviewStatus = catchAsync(async (req, res) => {
  const interview = await interviewService.updateInterviewStatus(req.params.id, req.body.status);
  res.status(200).json({ success: true, interview });
});
