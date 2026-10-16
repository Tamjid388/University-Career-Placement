
import express from "express";
import { resumebuilderController } from "../controllers/resumebuilder.controller.js";



const router = express.Router();

router.post('/',resumebuilderController.createResume)

router.get("/user/:userId", resumebuilderController.getUserResumes);
router.delete("/:id", resumebuilderController.deleteResume);



export default router;