import express from "express";
import {
  createOrUpdatePortfolio,
  getMyPortfolio,
  getPortfolioBySlug,
} from "../controllers/portfolio.controller.js";
import { verifyToken } from "../middlewares/verifytoken.js";
import { validate } from "../middlewares/validate.js";
import { portfolioSchema } from "../validations/portfolio.schema.js";

const router = express.Router();

router.post("/create", verifyToken, validate(portfolioSchema), createOrUpdatePortfolio);
router.get("/my", verifyToken, getMyPortfolio);
router.get("/my", getMyPortfolio);
router.get("/public/:slug", getPortfolioBySlug);

export default router;
