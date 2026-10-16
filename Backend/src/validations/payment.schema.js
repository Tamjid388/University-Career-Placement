import { z } from "zod";

export const createPaymentSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  email: z.string().trim().toLowerCase().email("Valid email is required"),
  amount: z.number().positive("Amount must be positive"),
});
