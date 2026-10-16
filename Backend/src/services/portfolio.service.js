import { Portfolio } from "../models/portfolio.model.js";
import slugify from "slugify";
import { HttpError } from "../utils/httpError.js";

export const generateSlug = (name) => {
  const slugBase = slugify(name, { lower: true, strict: true });
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${slugBase}-${randomStr}`;
};

export const createOrUpdatePortfolio = async (userId, data) => {
  const existing = await Portfolio.findOne({ user: userId });
  if (existing) {
    if (!existing.slug && data.basicInfo?.name) {
      existing.slug = generateSlug(data.basicInfo.name);
      await existing.save();
    }
    const updated = await Portfolio.findOneAndUpdate({ user: userId }, data, { new: true });
    return { portfolio: updated, created: false };
  }
  const slug = data.basicInfo?.name ? generateSlug(data.basicInfo.name) : null;
  const portfolio = await Portfolio.create({ user: userId, slug, ...data });
  return { portfolio, created: true };
};

export const getMyPortfolio = async (userId) => {
  const portfolio = await Portfolio.findOne({ user: userId });
  if (!portfolio) throw new HttpError(404, "Portfolio not found");
  return portfolio;
};

export const getPortfolioBySlug = async (slug) => {
  const portfolio = await Portfolio.findOne({ slug });
  if (!portfolio) throw new HttpError(404, "Portfolio not found");
  const safePortfolio = portfolio.toObject();
  delete safePortfolio.user;
  delete safePortfolio._id;
  return safePortfolio;
};
