import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const scheduleInterviewSchema = z.object({
  jobId: objectId,
  candidateId: objectId,
  scheduledAt: z.string().min(1, "scheduledAt is required"),
  mode: z.enum(["Online", "Offline"]),
  locationOrLink: z.string().optional(),
  notes: z.string().optional(),
});

export const updateInterviewStatusSchema = z.object({
  status: z.enum(["Scheduled", "Completed", "Cancelled"]),
});
