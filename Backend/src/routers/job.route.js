import express from 'express';
import { createJob, deleteJob, getAllJobs, getAllJobsForAdmin, getJobById, getMyJobs, getRecommendedJobs, searchJobs, updateJob, updateJobStatus } from '../controllers/job.controller.js';
import { verifyToken } from '../middlewares/verifytoken.js';
import { requireEmployer } from './../middlewares/requireemployer.js';
import { checkAdmin } from '../middlewares/checkrole.js';
import { validate } from '../middlewares/validate.js';
import { createJobSchema, updateJobSchema, updateJobStatusSchema } from '../validations/job.schema.js';

const router = express.Router();
router.get("/", getAllJobs);         // Get all jobs, no filters
router.get("/my-jobs", verifyToken, requireEmployer, getMyJobs);         // Get all jobs, no filters
router.get("/search", searchJobs);  // Search jobs with filters
router.post("/", verifyToken, requireEmployer, validate(createJobSchema), createJob);
//For Admin
router.get("/admin/alljobs", verifyToken, checkAdmin, getAllJobsForAdmin)
router.put("/admin/:id/status", verifyToken, checkAdmin, validate(updateJobStatusSchema), updateJobStatus)

router.get('/recommendations/:jobId', getRecommendedJobs)
router.get("/:id", getJobById);
router.put("/:id", verifyToken, requireEmployer, validate(updateJobSchema), updateJob);
router.delete("/:id", verifyToken, requireEmployer, deleteJob);

export default router;
