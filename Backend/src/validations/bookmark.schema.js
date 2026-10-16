import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const toggleBookmarkSchema = z.object({
  targetType: z.enum(["job", "company"]),
  targetId: objectId,
});
