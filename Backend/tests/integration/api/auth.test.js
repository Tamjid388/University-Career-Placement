import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../../src/app.js";

describe("auth api", () => {
  it("registers a user and sets the token cookie", async () => {
    const res = await request(app)
      .post("/api/v1/user/register")
      .send({ name: "T", email: "api@test.com", password: "password123" });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.headers["set-cookie"]?.join()).toMatch(/token=/);
  });

  it("rejects a duplicate registration", async () => {
    const body = { name: "T", email: "dupapi@test.com", password: "password123" };
    await request(app).post("/api/v1/user/register").send(body);
    const res = await request(app).post("/api/v1/user/register").send(body);
    expect(res.status).toBe(400);
  });

  it("rejects invalid input with 400", async () => {
    const res = await request(app)
      .post("/api/v1/user/register")
      .send({ name: "", email: "bad", password: "x" });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("logs in with correct credentials", async () => {
    await request(app)
      .post("/api/v1/user/register")
      .send({ name: "T", email: "loginapi@test.com", password: "password123" });
    const res = await request(app)
      .post("/api/v1/user/login")
      .send({ email: "loginapi@test.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("loginapi@test.com");
  });

  it("rejects login with a wrong password", async () => {
    await request(app)
      .post("/api/v1/user/register")
      .send({ name: "T", email: "badlogin@test.com", password: "password123" });
    const res = await request(app)
      .post("/api/v1/user/login")
      .send({ email: "badlogin@test.com", password: "nope1234" });
    expect(res.status).toBe(400);
  });
});
