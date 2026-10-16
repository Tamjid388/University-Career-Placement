import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const createJobSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  vacancy: z.string().min(1, "Vacancy is required"),
  description: z.string().optional(),
  company: objectId,
  jobType: z.enum(["full-time", "part-time", "internship", "contract"]),
  industry: z.string().min(1, "Industry is required"),
  location: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  image: z.string().optional(),
  deadline: z.string().optional(),
  skillsRequired: z.array(z.string()).optional(),
  salaryRange: z.object({ min: z.number().optional(), max: z.number().optional() }).optional(),
  salaryType: z.enum(["Monthly", "Yearly", "Hourly", "Negotiable"]).optional(),
  currency: z.enum(["USD", "INR", "BDT", "Other"]).optional(),
  jobLevel: z.enum(["Entry", "Mid", "Senior", "Executive", "Top Level", "Other"]).optional(),
  jobShift: z.enum(["Day", "Night", "Flexible", "Rotational", "Remote"]).optional(),
  gender: z.enum(["Male", "Female", "Any"]).optional(),
  minEducationLevel: z.string().optional(),
  preferredEducationLevel: z.string().optional(),
  totalExperience: z.number().optional(),
  minExperience: z.number().optional(),
  maxExperience: z.number().optional(),
  minAge: z.number().optional(),
  maxAge: z.number().optional(),
  jobRequirements: z.string().optional(),
});

export const updateJobSchema = createJobSchema.omit({ company: true }).partial();

export const updateJobStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});
