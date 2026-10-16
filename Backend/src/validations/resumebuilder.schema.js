import { z } from "zod";

export const createResumeSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId"),
  templateId: z.string().min(1, "templateId is required"),
  templateTitle: z.string().optional(),
  about: z.object({}).passthrough().optional(),
  education: z.array(z.object({}).passthrough()).optional(),
  experience: z.array(z.object({}).passthrough()).optional(),
  skills: z.array(z.object({}).passthrough()).optional(),
  projects: z.array(z.object({}).passthrough()).optional(),
  additional: z.object({}).passthrough().optional(),
}).passthrough();
