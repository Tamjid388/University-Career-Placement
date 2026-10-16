import * as portfolioService from "../services/portfolio.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const generateSlug = portfolioService.generateSlug;

export const createOrUpdatePortfolio = catchAsync(async (req, res) => {
  try {
    const { portfolio, created } = await portfolioService.createOrUpdatePortfolio(req.user.id, req.body);
    res.status(created ? 201 : 200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: "Failed to save portfolio", error });
  }
});

export const getMyPortfolio = catchAsync(async (req, res) => {
  try {
    const portfolio = await portfolioService.getMyPortfolio(req.user.id);
    res.status(200).json(portfolio);
  } catch (error) {
    if (error?.statusCode === 404) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    res.status(500).json({ message: "Failed to fetch portfolio", error });
  }
});

export const getPortfolioBySlug = catchAsync(async (req, res) => {
  try {
    const portfolio = await portfolioService.getPortfolioBySlug(req.params.slug);
    res.status(200).json(portfolio);
  } catch (error) {
    if (error?.statusCode === 404) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    res.status(500).json({ message: "Failed to fetch public portfolio", error });
  }
});
