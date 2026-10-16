import { describe, it, expect } from "vitest";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../../../src/validations/user.schema.js";

describe("user schemas", () => {
  it("rejects forgot-password with bad email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });

  it("accepts a valid forgot-password request", () => {
    expect(forgotPasswordSchema.safeParse({ email: "a@b.com" }).success).toBe(true);
  });

  it("rejects reset-password with short new password", () => {
    expect(
      resetPasswordSchema.safeParse({ email: "a@b.com", token: "t", newPassword: "123" }).success
    ).toBe(false);
  });

  it("rejects change-password when old password is missing", () => {
    expect(changePasswordSchema.safeParse({ newPassword: "newpass1" }).success).toBe(false);
  });
});
