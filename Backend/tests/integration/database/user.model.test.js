import { describe, it, expect } from "vitest";
import { User } from "../../../src/models/user.model.js";

describe("User model", () => {
  it("defaults role to job-seeker", async () => {
    const user = await User.create({ name: "M", email: "model@test.com" });
    expect(user.role).toBe("job-seeker");
  });

  it("enforces unique email", async () => {
    await User.create({ name: "M", email: "unique@test.com" });
    await expect(User.create({ name: "M2", email: "unique@test.com" })).rejects.toThrow();
  });

  it("allows accounts without a password (OAuth)", async () => {
    const user = await User.create({ name: "M", email: "oauth@test.com", password: null });
    expect(user.password).toBeNull();
  });
});
