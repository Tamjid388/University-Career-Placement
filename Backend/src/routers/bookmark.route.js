import express from "express";
import { verifyToken } from "../middlewares/verifytoken.js";
import { requireJobSeeker } from "../middlewares/requirejobseeker.js";
import {
  checkBookmark,
  getMyBookmarks,
  removeBookmark,
  toggleBookmark,
} from "../controllers/bookmark.controller.js";

const router = express.Router();

router.post("/toggle", verifyToken, requireJobSeeker, toggleBookmark);
router.get("/my", verifyToken, requireJobSeeker, getMyBookmarks);
router.get("/check", verifyToken, requireJobSeeker, checkBookmark);
router.delete("/:id", verifyToken, requireJobSeeker, removeBookmark);

export default router;
