import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const createSkillSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  category: z.string().trim().min(1, "Category is required"),
  description: z.string().optional(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  icon_url: z.string().optional(),
  is_active: z.boolean().optional(),
});

export const updateSkillSchema = createSkillSchema.partial();

export const createAssessmentSchema = z.object({
  skill_id: objectId,
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional(),
  duration_seconds: z.number().positive().optional(),
  difficulty_level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  total_questions: z.number().positive().optional(),
  is_active: z.boolean().optional(),
  questions: z.array(z.object({}).passthrough()).optional(),
}).passthrough();

export const startAttemptSchema = z.object({
  userId: objectId,
});

export const submitAnswersSchema = z.object({
  answers: z.array(
    z.object({
      question_id: z.string().min(1),
      selected_options: z.array(z.string()),
    })
  ),
});
