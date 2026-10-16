import { describe, it, expect } from "vitest";
import * as authService from "../../../src/services/auth.service.js";

describe("auth.service", () => {
  it("googleLogin creates a new job-seeker on first login", async () => {
    const { user, token } = await authService.googleLogin({ name: "G", email: "g@test.com" });
    expect(user.email).toBe("g@test.com");
    expect(user.role).toBe("job-seeker");
    expect(typeof token).toBe("string");
  });

  it("googleLogin returns the existing user on repeat login", async () => {
    const first = await authService.googleLogin({ name: "G", email: "repeat@test.com" });
    const second = await authService.googleLogin({ name: "G", email: "repeat@test.com" });
    expect(String(second.user._id)).toBe(String(first.user._id));
  });
});
