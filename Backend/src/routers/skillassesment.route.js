import express from "express";
import { skillAssessmentController } from "../controllers/skillassesment.controller.js";
import { verifyToken } from "../middlewares/verifytoken.js";
import { checkAdmin } from "../middlewares/checkrole.js";

const router = express.Router();

router.post("/", skillAssessmentController.createSkillAssessment);
router.get("/", skillAssessmentController.getSkills);
router.put("/:id", verifyToken, checkAdmin, skillAssessmentController.updateSkill);
router.delete("/:id", verifyToken, checkAdmin, skillAssessmentController.deleteSkill);
router.post("/createassesment", skillAssessmentController.createassesment);
router.get("/skills/:skillId", skillAssessmentController.getAssessmentsBySkill);
router.post(
  "/assessments/:assessmentId/start",
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
  skillAssessmentController.submitAnswers
);
router.post(
  "/attempts/:attemptId/submit",
  skillAssessmentController.submitAssessment
);
export default router;
