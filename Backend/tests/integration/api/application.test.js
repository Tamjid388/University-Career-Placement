import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../../src/app.js";
import { makeCompany, makeJob, makeUser, registerAndLogin } from "../../setup/factories.js";

describe("application api", () => {
  it("rejects apply without auth", async () => {
    const res = await request(app)
      .post("/api/v1/application/apply")
      .send({ jobId: "507f1f77bcf86cd799439011" });
    expect(res.status).toBe(401);
  });

  it("applies once, rejects a duplicate, and lists my applications", async () => {
    const employer = await makeUser({ role: "employer" });
    const company = await makeCompany(String(employer._id));
    const job = await makeJob(String(employer._id), String(company._id));
    const { cookie } = await registerAndLogin("job-seeker");

    const first = await request(app)
      .post("/api/v1/application/apply")
      .set("Cookie", cookie)
      .send({ jobId: String(job._id), coverLetter: "Hi" });
    expect(first.status).toBe(201);

    const duplicate = await request(app)
      .post("/api/v1/application/apply")
      .set("Cookie", cookie)
      .send({ jobId: String(job._id) });
    expect(duplicate.status).toBe(400);

    const mine = await request(app).get("/api/v1/application/my").set("Cookie", cookie);
    expect(mine.status).toBe(200);
    expect(mine.body.applications).toHaveLength(1);
  });
});
