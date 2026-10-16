import  express  from 'express';
import {Statistics} from '../controllers/stat.controller.js';
import { verifyToken } from '../middlewares/verifytoken.js';
import { checkAdmin } from '../middlewares/checkrole.js';
const router = express.Router();


router.get('/userStat',verifyToken,Statistics.UserStatistics)
router.get('/employerStat',verifyToken,Statistics.EmployerStatistics)
router.get('/adminStat',verifyToken,checkAdmin,Statistics.AdminStatistics)


export default router