import express from "express";
import { resumebuilderController } from "../controllers/resumebuilder.controller.js";
import { validate } from "../middlewares/validate.js";
import { createResumeSchema } from "../validations/resumebuilder.schema.js";

const router = express.Router();

router.post('/', validate(createResumeSchema), resumebuilderController.createResume)

router.get("/user/:userId", resumebuilderController.getUserResumes);
router.delete("/:id", resumebuilderController.deleteResume);

export default router;
