import { describe, it, expect } from "vitest";
import { Job } from "../../../src/models/job.model.js";
import { makeUser, makeCompany } from "../../setup/factories.js";

describe("Job model", () => {
  it("defaults status to pending", async () => {
    const employer = await makeUser({ role: "employer" });
    const company = await makeCompany(String(employer._id));
    const job = await Job.create({
      title: "M",
      vacancy: "1",
      company: company._id,
      postedBy: employer._id,
      jobType: "full-time",
      industry: "Software",
    });
    expect(job.status).toBe("pending");
  });

  it("requires company and postedBy", async () => {
    await expect(Job.create({ title: "M", vacancy: "1" })).rejects.toThrow();
  });
});
