import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Valid email is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Valid email is required"),
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  primaryRole: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  yearsExperience: z.string().optional(),
  picture: z.string().optional(),
  resume: z.string().optional(),
  education: z.array(z.object({}).passthrough()).optional(),
  workExperience: z.array(z.object({}).passthrough()).optional(),
  socialLinks: z.object({}).passthrough().optional(),
  certifications: z.array(z.object({}).passthrough()).optional(),
  languages: z.array(z.string()).optional(),
  projects: z.array(z.object({}).passthrough()).optional(),
  address: z.object({}).passthrough().optional(),
  dob: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});
