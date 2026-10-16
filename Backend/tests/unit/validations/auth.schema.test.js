import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema, googleLoginSchema } from "../../../src/validations/auth.schema.js";

describe("auth schemas", () => {
  it("accepts a valid registration", () => {
    const result = registerSchema.safeParse({
      name: "A",
      email: "a@b.com",
      password: "secret1",
      role: "job-seeker",
    });
    expect(result.success).toBe(true);
  });

  it("rejects bad email and short password", () => {
    expect(registerSchema.safeParse({ name: "", email: "bad", password: "x" }).success).toBe(false);
  });

  it("allows registration without password (OAuth flow)", () => {
    expect(registerSchema.safeParse({ name: "A", email: "a@b.com" }).success).toBe(true);
  });

  it("rejects login without password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com" }).success).toBe(false);
  });

  it("rejects google login without name", () => {
    expect(googleLoginSchema.safeParse({ email: "a@b.com" }).success).toBe(false);
  });
});
