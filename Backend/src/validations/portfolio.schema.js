import { z } from "zod";

export const portfolioSchema = z.object({
  basicInfo: z.object({}).passthrough().optional(),
  skills: z.array(z.object({}).passthrough()).optional(),
  projects: z.array(z.object({}).passthrough()).optional(),
  education: z.array(z.object({}).passthrough()).optional(),
  experience: z.array(z.object({}).passthrough()).optional(),
  certifications: z.array(z.object({}).passthrough()).optional(),
  blogs: z.array(z.object({}).passthrough()).optional(),
  socialLinks: z.object({}).passthrough().optional(),
  templateId: z.string().optional(),
}).passthrough();
