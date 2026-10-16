import mongoose from "mongoose";
import { SkillAssessment, SkillAssessmentQuestions, Attempt } from "../models/skillassesment.model.js";
import { HttpError } from "../utils/httpError.js";

const SKILL_ALLOWED_UPDATES = ["name", "category", "description", "difficulty", "icon_url", "is_active"];

export const createSkill = async (data) => {
  const skill = new SkillAssessment(data);
  await skill.save();
  return skill;
};

export const getSkills = async () => {
  const skills = await SkillAssessment.find().sort({ created_at: -1 });
  const counts = await SkillAssessmentQuestions.aggregate([
    { $group: { _id: "$skill_id", assessmentCount: { $sum: 1 }, questionCount: { $sum: "$total_questions" } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c]));
  return skills.map((s) => {
    const c = countMap.get(String(s._id));
    return { ...s.toObject(), assessmentCount: c?.assessmentCount ?? 0, questionCount: c?.questionCount ?? 0 };
  });
};

export const updateSkill = async (id, data) => {
  const updates = {};
  for (const key of SKILL_ALLOWED_UPDATES) {
    if (data[key] !== undefined) updates[key] = data[key];
  }
  const skill = await SkillAssessment.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!skill) throw new HttpError(404, "Skill not found");
  return skill;
};

export const deleteSkill = async (id) => {
  const skill = await SkillAssessment.findById(id);
  if (!skill) throw new HttpError(404, "Skill not found");
  const assessments = await SkillAssessmentQuestions.find({ skill_id: id }).select("_id");
  const assessmentIds = assessments.map((a) => a._id);
  if (assessmentIds.length > 0) {
    await Attempt.deleteMany({ assessment_id: { $in: assessmentIds } });
    await SkillAssessmentQuestions.deleteMany({ skill_id: id });
  }
  await skill.deleteOne();
  return { deletedAssessments: assessmentIds.length };
};

export const createAssessment = async (data) => SkillAssessmentQuestions.create(data);

export const getAssessmentsBySkill = async (skillId) => {
  const assessments = await SkillAssessmentQuestions.find(
    { skill_id: skillId },
    { _id: 1, skill_id: 1, title: 1, description: 1, duration_seconds: 1 }
  );
  if (!assessments || assessments.length === 0) {
    throw new HttpError(404, "No assessments found for this skill");
  }
  return assessments;
};

export const startAttempt = async (assessmentId, userId) => {
  if (!userId) throw new HttpError(400, "User ID is required");
  const assessment = await SkillAssessmentQuestions.findById(assessmentId);
  if (!assessment) throw new HttpError(404, "Assessment not found");
  const attempt = new Attempt({ user_id: userId, assessment_id: assessment._id, start_time: new Date(), status: "in_progress", answers: [] });
  await attempt.save();
  return attempt;
};

export const getAllAttempts = async () => Attempt.find();

export const getQuestionsForAttempt = async (attemptId) => {
  const attempt = await Attempt.findById(attemptId);
  if (!attempt) throw new HttpError(404, "Attempt not found");
  const assessment = await SkillAssessmentQuestions.findById(attempt.assessment_id).select("title questions");
  if (!assessment) throw new HttpError(404, "Assessment not found");
  return { attempt, assessment };
};

const scoreAnswer = (question, selected_options) => {
  if (!["MCQ", "Multiple", "TrueFalse"].includes(question.type)) return 0;
  const correctOptions = question.options.filter((opt) => opt.is_correct).map((opt) => opt.text);
  if (question.type === "MCQ" || question.type === "TrueFalse") {
    return selected_options.length === 1 && correctOptions.includes(selected_options[0]) ? question.points : 0;
  }
  const selectedSet = new Set(selected_options);
  const correctSet = new Set(correctOptions);
  return selectedSet.size === correctSet.size && [...selectedSet].every((opt) => correctSet.has(opt))
    ? question.points
    : 0;
};

export const submitAnswers = async (attemptId, answers) => {
  if (!answers || !Array.isArray(answers)) throw new HttpError(400, "Answers array is required");
  const attempt = await Attempt.findById(attemptId);
  if (!attempt) throw new HttpError(404, "Attempt not found");
  if (attempt.status !== "in_progress") {
    throw new HttpError(400, "Attempt is already completed or expired");
  }
  const assessment = await SkillAssessmentQuestions.findById(attempt.assessment_id);
  if (!assessment) throw new HttpError(404, "Assessment not found");
  for (const answer of answers) {
    const { question_id, selected_options } = answer;
    const question = assessment.questions.id(question_id);
    if (!question) continue;
    const existingIndex = attempt.answers.findIndex((a) => a.question_id.toString() === question_id.toString());
    const answerData = { question_id, selected_options, points_scored: scoreAnswer(question, selected_options) };
    if (existingIndex !== -1) attempt.answers[existingIndex] = answerData;
    else attempt.answers.push(answerData);
  }
  await attempt.save();
  return attempt;
};

export const submitAssessment = async (attemptId) => {
  const attempt = await Attempt.findById(attemptId);
  if (!attempt) throw new HttpError(400, "Attempt not found");
  if (attempt.status === "completed") throw new HttpError(400, "Attempt is already completed");
  const assessment = await SkillAssessmentQuestions.findById(attempt.assessment_id);
  if (!assessment) throw new HttpError(404, "Assessment not found");
  const totalScore = attempt.answers.reduce((sum, a) => sum + (a.points_scored || 0), 0);
  const maxScore = assessment.questions.reduce((sum, q) => sum + q.points, 0);
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  const detailedResults = assessment.questions.map((question) => {
    const userAnswer = attempt.answers.find((ans) => ans.question_id.toString() === question._id.toString());
    const correctOptions = question.options.filter((opt) => opt.is_correct).map((opt) => opt.text);
    let isCorrect = false;
    if (userAnswer && (question.type === "MCQ" || question.type === "TrueFalse")) {
      isCorrect = userAnswer.selected_options.length === 1 && correctOptions.includes(userAnswer.selected_options[0]);
    }
    return {
      question_id: question._id,
      question_text: question.text,
      question_type: question.type,
      points: question.points,
      user_answer: userAnswer ? userAnswer.selected_options : [],
      correct_answer: correctOptions,
      is_correct: isCorrect,
      points_scored: userAnswer ? userAnswer.points_scored : 0,
      explanation: question.explanation || null,
      options: question.options.map((opt) => ({ text: opt.text, is_correct: opt.is_correct })),
    };
  });
  attempt.status = "completed";
  attempt.end_time = new Date();
  attempt.total_score = totalScore;
  attempt.max_score = maxScore;
  attempt.percentage = percentage;
  await attempt.save();
  return {
    attemptId: attempt._id,
    status: attempt.status,
    totalScore,
    maxScore,
    percentage: percentage.toFixed(2),
    answeredQuestions: attempt.answers.length,
    totalQuestions: assessment.questions.length,
    timeTaken: Math.floor((attempt.end_time - attempt.start_time) / 1000),
    results: detailedResults,
  };
};
