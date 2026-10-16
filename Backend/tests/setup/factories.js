import request from "supertest";
import app from "../../src/app.js";
import { User } from "../../src/models/user.model.js";
import { Company } from "../../src/models/company.model.js";
import { Job } from "../../src/models/job.model.js";

let counter = 0;
const uniqueEmail = (prefix = "user") => `${prefix}-${Date.now()}-${counter++}@test.com`;

export const makeUser = (overrides = {}) =>
  User.create({
    name: "Test User",
    email: uniqueEmail(),
    password: null,
    role: "job-seeker",
    ...overrides,
  });

export const registerAndLogin = async (role = "job-seeker") => {
  const email = uniqueEmail(role.replace("-", ""));
  const res = await request(app)
    .post("/api/v1/user/register")
    .send({ name: "Test", email, password: "password123", role });
  const cookie = res.headers["set-cookie"]?.[0]?.split(";")[0];
  return { user: res.body.user, cookie, email };
};

export const makeCompany = (employerId, overrides = {}) =>
  Company.create({
    name: "Test Co",
    industry: "Software",
    employees: "1-25",
    contactPersonName: "CP",
    contactPersonDesignation: "HR",
    contactPersonEmail: "cp@test.com",
    contactPersonMobile: "01000",
    description: "desc",
    createdBy: employerId,
    ...overrides,
  });

export const makeJob = (employerId, companyId, overrides = {}) =>
  Job.create({
    title: "Dev",
    vacancy: "2",
    company: companyId,
    postedBy: employerId,
    jobType: "full-time",
    industry: "Software",
    status: "approved",
    ...overrides,
  });
