import express from "express";
import { skillAssessmentController } from "../controllers/skillassesment.controller.js";
import { verifyToken } from "../middlewares/verifytoken.js";
import { checkAdmin } from "../middlewares/checkrole.js";
import { validate } from "../middlewares/validate.js";
import {
  createAssessmentSchema,
  createSkillSchema,
  startAttemptSchema,
  submitAnswersSchema,
  updateSkillSchema,
} from "../validations/skillassesment.schema.js";

const router = express.Router();

router.post("/", validate(createSkillSchema), skillAssessmentController.createSkillAssessment);
router.get("/", skillAssessmentController.getSkills);
router.put("/:id", verifyToken, checkAdmin, validate(updateSkillSchema), skillAssessmentController.updateSkill);
router.delete("/:id", verifyToken, checkAdmin, skillAssessmentController.deleteSkill);
router.post("/createassesment", validate(createAssessmentSchema), skillAssessmentController.createassesment);
router.get("/skills/:skillId", skillAssessmentController.getAssessmentsBySkill);
router.post(
  "/assessments/:assessmentId/start",
  validate(startAttemptSchema),
  skillAssessmentController.startAttempt
);
router.get(
  "/assessments/attempt/getAllatempts",
  skillAssessmentController.getAllatempts
);
router.get(
  "/attempts/:attemptId/questions",
  skillAssessmentController.getQuestionsForAttempt
);
router.post(
  "/attempts/:attemptId/answers",
  validate(submitAnswersSchema),
  skillAssessmentController.submitAnswers
);
router.post(
  "/attempts/:attemptId/submit",
  skillAssessmentController.submitAssessment
);
export default router;
