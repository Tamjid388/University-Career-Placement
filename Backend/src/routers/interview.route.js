import express from 'express';
import { getEmployerInterviews, scheduleInterview, updateInterviewStatus } from '../controllers/interview.controller.js';
import { verifyToken } from '../middlewares/verifytoken.js';
import { requireEmployer } from '../middlewares/requireemployer.js';

const router = express.Router();

router.post('/schedule', verifyToken, scheduleInterview);
router.get('/employer', verifyToken,requireEmployer, getEmployerInterviews);
router.put('/:id/status', verifyToken, updateInterviewStatus);


export default router;