import { describe, it, expect } from "vitest";
import {
  createJobSchema,
  updateJobSchema,
  updateJobStatusSchema,
} from "../../../src/validations/job.schema.js";

const base = {
  title: "Dev",
  vacancy: "2",
  company: "507f1f77bcf86cd799439011",
  jobType: "full-time",
  industry: "Software",
};

describe("job schemas", () => {
  it("accepts a minimal valid job", () => {
    expect(createJobSchema.safeParse(base).success).toBe(true);
  });

  it("rejects a non-ObjectId company", () => {
    expect(createJobSchema.safeParse({ ...base, company: "nope" }).success).toBe(false);
  });

  it("rejects an unknown job type", () => {
    expect(createJobSchema.safeParse({ ...base, jobType: "volunteer" }).success).toBe(false);
  });

  it("allows partial updates", () => {
    const result = updateJobSchema.safeParse({ title: "New title" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid status value", () => {
    expect(updateJobStatusSchema.safeParse({ status: "weird" }).success).toBe(false);
  });
});
