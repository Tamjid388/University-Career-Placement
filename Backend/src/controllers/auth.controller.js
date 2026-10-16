import * as authService from "../services/auth.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const registerUser = catchAsync(async (req, res) => {
  try {
    const { email, password, fullname, role } = req.body;
    const newUser = await authService.registerWithFirebase({ email, password, fullname, role });
    return res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    const message = statusCode >= 500 ? "Error registering user" : error.message;
    if (statusCode >= 500) console.error(error);
    return res.status(statusCode).json({ message, error: statusCode >= 500 ? error.message : undefined });
  }
});
