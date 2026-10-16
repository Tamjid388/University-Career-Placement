import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../../src/app.js";
import { registerAndLogin } from "../../setup/factories.js";

const companyBody = {
  name: "API Co",
  industry: "Software",
  employees: "1-25",
  contactPersonName: "CP",
  contactPersonDesignation: "HR",
  contactPersonEmail: "cp@api.com",
  contactPersonMobile: "01000",
  description: "desc",
};

describe("job api", () => {
  it("lists jobs with a paginated shape", async () => {
    const res = await request(app).get("/api/v1/job");
    expect(res.status).toBe(200);
    expect(res.body.jobs).toBeDefined();
    expect(res.body.total).toBeDefined();
  });

  it("rejects job creation without auth", async () => {
    const res = await request(app).post("/api/v1/job").send({ title: "X" });
    expect(res.status).toBe(401);
  });

  it("creates and fetches a job as an employer", async () => {
    const { cookie } = await registerAndLogin("employer");
    const companyRes = await request(app)
      .post("/api/v1/company/createcompany")
      .set("Cookie", cookie)
      .send(companyBody);
    expect(companyRes.status).toBe(201);

    const jobRes = await request(app)
      .post("/api/v1/job")
      .set("Cookie", cookie)
      .send({
        title: "API Dev",
        vacancy: "3",
        company: companyRes.body.company._id,
        jobType: "full-time",
        industry: "Software",
      });
    expect(jobRes.status).toBe(201);

    const getRes = await request(app).get(`/api/v1/job/${jobRes.body.job._id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.job.title).toBe("API Dev");
  });

  it("rejects job creation with invalid input", async () => {
    const { cookie } = await registerAndLogin("employer");
    const res = await request(app)
      .post("/api/v1/job")
      .set("Cookie", cookie)
      .send({ title: "Missing fields" });
    expect(res.status).toBe(400);
  });
});
