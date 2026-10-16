import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const applyToJobSchema = z.object({
  jobId: objectId,
  resume: z.string().optional(),
  coverLetter: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["Pending", "Accepted", "Rejected"]),
});
