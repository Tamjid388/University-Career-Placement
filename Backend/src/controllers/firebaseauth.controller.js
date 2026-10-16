import * as authService from "../services/auth.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const googleLogin = catchAsync(async (req, res) => {
  const { name, email } = req.body;
  const { user, token } = await authService.googleLogin({ name, email });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 5 * 24 * 60 * 60 * 1000,
    domain: process.env.NODE_ENV === "production" ? ".smartjob-clientside.vercel.app" : undefined,
  });
  res.status(200).json({
    success: true,
    message: "Google login successful",
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});
