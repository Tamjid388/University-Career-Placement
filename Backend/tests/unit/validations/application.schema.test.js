import { describe, it, expect } from "vitest";
import {
  applyToJobSchema,
  updateApplicationStatusSchema,
} from "../../../src/validations/application.schema.js";

describe("application schemas", () => {
  it("accepts a valid apply request", () => {
    expect(
      applyToJobSchema.safeParse({ jobId: "507f1f77bcf86cd799439011", coverLetter: "Hi" }).success
    ).toBe(true);
  });

  it("rejects a non-ObjectId jobId", () => {
    expect(applyToJobSchema.safeParse({ jobId: "nope" }).success).toBe(false);
  });

  it("rejects an invalid status value", () => {
    expect(updateApplicationStatusSchema.safeParse({ status: "Maybe" }).success).toBe(false);
  });
});
