import mongoose from "mongoose";
import { describe, it, expect } from "vitest";
import * as jobService from "../../../src/services/job.service.js";
import { makeUser, makeCompany } from "../../setup/factories.js";

const jobData = (companyId) => ({
  title: "Dev",
  vacancy: "2",
  company: String(companyId),
  jobType: "full-time",
  industry: "Software",
});

describe("job.service", () => {
  it("createJob rejects a company the employer does not own", async () => {
    const employer = await makeUser({ role: "employer" });
    const other = await makeUser({ role: "employer" });
    const company = await makeCompany(String(other._id));
    await expect(jobService.createJob(String(employer._id), jobData(company._id))).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("createJob saves with pending status", async () => {
    const employer = await makeUser({ role: "employer" });
    const company = await makeCompany(String(employer._id));
    const job = await jobService.createJob(String(employer._id), jobData(company._id));
    expect(job.status).toBe("pending");
  });

  it("getJobById throws 404 for a missing job", async () => {
    await expect(jobService.getJobById(new mongoose.Types.ObjectId())).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("updateJob rejects a non-owner", async () => {
    const employer = await makeUser({ role: "employer" });
    const stranger = await makeUser({ role: "employer" });
    const company = await makeCompany(String(employer._id));
    const job = await jobService.createJob(String(employer._id), jobData(company._id));
    await expect(
      jobService.updateJob(String(stranger._id), String(job._id), { title: "Hijacked" })
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("updateJobStatus rejects a missing status", async () => {
    await expect(
      jobService.updateJobStatus(new mongoose.Types.ObjectId(), undefined)
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
