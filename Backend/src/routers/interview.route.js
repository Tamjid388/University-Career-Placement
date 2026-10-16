import express from 'express';
import { getEmployerInterviews, scheduleInterview, updateInterviewStatus } from '../controllers/interview.controller.js';
import { verifyToken } from '../middlewares/verifytoken.js';
import { requireEmployer } from '../middlewares/requireemployer.js';
import { validate } from '../middlewares/validate.js';
import { scheduleInterviewSchema, updateInterviewStatusSchema } from '../validations/interview.schema.js';

const router = express.Router();

router.post('/schedule', verifyToken, validate(scheduleInterviewSchema), scheduleInterview);
router.get('/employer', verifyToken, requireEmployer, getEmployerInterviews);
router.put('/:id/status', verifyToken, validate(updateInterviewStatusSchema), updateInterviewStatus);

export default router;
