import { describe, it, expect } from "vitest";
import * as applicationService from "../../../src/services/application.service.js";
import { makeUser, makeCompany, makeJob } from "../../setup/factories.js";

describe("application.service", () => {
  it("applyToJob creates an application", async () => {
    const employer = await makeUser({ role: "employer" });
    const seeker = await makeUser({ role: "job-seeker" });
    const company = await makeCompany(String(employer._id));
    const job = await makeJob(String(employer._id), String(company._id));
    const app = await applicationService.applyToJob(String(seeker._id), {
      jobId: String(job._id),
      coverLetter: "Hi",
    });
    expect(String(app.applicant)).toBe(String(seeker._id));
  });

  it("applyToJob rejects a duplicate application", async () => {
    const employer = await makeUser({ role: "employer" });
    const seeker = await makeUser({ role: "job-seeker" });
    const company = await makeCompany(String(employer._id));
    const job = await makeJob(String(employer._id), String(company._id));
    await applicationService.applyToJob(String(seeker._id), { jobId: String(job._id) });
    await expect(
      applicationService.applyToJob(String(seeker._id), { jobId: String(job._id) })
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
