import express from "express";
import { verifyToken } from './../middlewares/verifytoken.js';
import { applyToJob, getAllApplicationsForEmployer, getApplicationsForJob, getMyApplications, updateApplicationStatus } from "../controllers/application.controller.js";
import { requireJobSeeker } from "../middlewares/requirejobseeker.js";
import { requireEmployer } from './../middlewares/requireemployer.js';
import { validate } from "../middlewares/validate.js";
import { applyToJobSchema, updateApplicationStatusSchema } from "../validations/application.schema.js";

const router = express.Router();

router.post("/apply", verifyToken, requireJobSeeker, validate(applyToJobSchema), applyToJob);

router.get("/my", verifyToken, requireJobSeeker, getMyApplications);

router.get("/all-applications", verifyToken, requireEmployer, getAllApplicationsForEmployer);

router.get("/job/:jobId", verifyToken, requireEmployer, getApplicationsForJob);

router.put("/:applicationId", verifyToken, requireEmployer, validate(updateApplicationStatusSchema), updateApplicationStatus);

export default router;
