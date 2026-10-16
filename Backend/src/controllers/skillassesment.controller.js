import * as skillService from "../services/skillassesment.service.js";
import { catchAsync } from "../utils/catchAsync.js";

const createSkillAssessment = catchAsync(async (req, res) => {
  const skill = await skillService.createSkill(req.body);
  res.status(201).json({ success: true, message: "Skill assessment created", data: skill });
});

const getSkills = catchAsync(async (req, res) => {
  const data = await skillService.getSkills();
  res.status(200).json({ success: true, data, message: "Skill assesmment fetched succesfully" });
});

const updateSkill = catchAsync(async (req, res) => {
  const skill = await skillService.updateSkill(req.params.id, req.body);
  res.status(200).json({ success: true, message: "Skill updated successfully", data: skill });
});

const deleteSkill = catchAsync(async (req, res) => {
  const data = await skillService.deleteSkill(req.params.id);
  res.status(200).json({ success: true, message: "Skill and its assessments deleted successfully", data });
});

const createassesment = catchAsync(async (req, res) => {
  try {
    const assessment = await skillService.createAssessment(req.body);
    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, description: error.message, message: "Failed to add assesment questions" });
  }
});

const getAssessmentsBySkill = catchAsync(async (req, res) => {
  const assessments = await skillService.getAssessmentsBySkill(req.params.skillId);
  res.status(200).json({ success: true, data: assessments });
});

const startAttempt = catchAsync(async (req, res) => {
  const attempt = await skillService.startAttempt(req.params.assessmentId, req.body.userId);
  res.status(201).json({ success: true, attemptId: attempt._id, message: "Attempt started successfully" });
});

const getAllatempts = catchAsync(async (req, res) => {
  const allattempts = await skillService.getAllAttempts();
  if (!allattempts || allattempts.length === 0) {
    return res.status(404).json({ success: false, message: "No attempts found.", data: [] });
  }
  return res.status(200).json({ success: true, total_Attempts: allattempts.length, data: allattempts });
});

const getQuestionsForAttempt = catchAsync(async (req, res) => {
  const { attempt, assessment } = await skillService.getQuestionsForAttempt(req.params.attemptId);
  res.status(200).json({
    success: true,
    attemptId: attempt._id,
    assessmentId: assessment._id,
    title: assessment.title,
    questions: assessment.questions,
  });
});

const submitAnswers = catchAsync(async (req, res) => {
  const attempt = await skillService.submitAnswers(req.params.attemptId, req.body.answers);
  res.status(200).json({
    success: true,
    message: "Answers submitted successfully",
    data: { attemptId: attempt._id, answersCount: attempt.answers.length },
  });
});

const submitAssessment = catchAsync(async (req, res) => {
  const data = await skillService.submitAssessment(req.params.attemptId);
  res.status(200).json({ success: true, message: "Assessment completed successfully", data });
});

export const skillAssessmentController = {
  createSkillAssessment,
  createassesment,
  getSkills,
  getAssessmentsBySkill,
  updateSkill,
  deleteSkill,
  startAttempt,
  getAllatempts,
  getQuestionsForAttempt,
  submitAnswers,
  submitAssessment,
};
