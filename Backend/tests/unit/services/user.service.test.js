import { describe, it, expect } from "vitest";
import * as userService from "../../../src/services/user.service.js";

describe("user.service", () => {
  it("register creates a user and returns a token", async () => {
    const { user, token, existing } = await userService.register({
      name: "U",
      email: "u@test.com",
      password: "password123",
    });
    expect(existing).toBe(false);
    expect(user.email).toBe("u@test.com");
    expect(typeof token).toBe("string");
  });

  it("register rejects a duplicate email for password signup", async () => {
    await userService.register({ name: "U", email: "dup@test.com", password: "password123" });
    await expect(
      userService.register({ name: "U", email: "dup@test.com", password: "password123" })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("login rejects a wrong password", async () => {
    await userService.register({ name: "U", email: "login@test.com", password: "password123" });
    await expect(
      userService.login({ email: "login@test.com", password: "wrongpass" })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("login rejects Google-only accounts with a clear message", async () => {
    await userService.register({ name: "G", email: "googleonly@test.com" });
    await expect(
      userService.login({ email: "googleonly@test.com", password: "password123" })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("forgotPassword returns a generic message for unknown emails", async () => {
    const message = await userService.forgotPassword("nobody@test.com");
    expect(message).toMatch(/If an account exists/);
  });

  it("resetPassword rejects an invalid token", async () => {
    await expect(
      userService.resetPassword({ email: "u@test.com", token: "bad", newPassword: "newpass123" })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("changePassword rejects a wrong old password", async () => {
    const { user } = await userService.register({
      name: "U",
      email: "chg@test.com",
      password: "password123",
    });
    await expect(
      userService.changePassword(String(user._id), { oldPassword: "nope123", newPassword: "newpass123" })
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
