import * as userService from "../services/user.service.js";
import { catchAsync } from "../utils/catchAsync.js";

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
    maxAge: 5 * 24 * 60 * 60 * 1000,
    path: "/",
  });
};

export const register = catchAsync(async (req, res) => {
  const { user, token, existing } = await userService.register(req.body);
  if (existing) {
    return res.status(200).json({
      success: true,
      message: "User already exists (logged in)",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  }
  setTokenCookie(res, token);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

export const login = catchAsync(async (req, res) => {
  const { user, token } = await userService.login(req.body);
  setTokenCookie(res, token);
  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

export const logout = catchAsync(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
    path: "/",
  });
  return res.status(200).json({ success: true, message: "Logged out successfully." });
});

export const updateUserProfile = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateProfile(req.user.id, req.body);
  res.status(200).json({ success: true, message: "Profile updated successfully", user: updatedUser });
});

export const getCurrentUser = catchAsync(async (req, res) => {
  const user = await userService.getCurrentUser(req.user.id);
  res.status(200).json({ success: true, user });
});

export const getuserData = catchAsync(async (req, res) => {
  try {
    const users = await userService.getAllUsersData();
    return res.status(200).json({ message: "Users data fetched successfully.", loggedInUser: req.user, users, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
});

export const forgotPassword = catchAsync(async (req, res) => {
  const message = await userService.forgotPassword(req.body.email);
  return res.status(200).json({ success: true, message });
});

export const resetPassword = catchAsync(async (req, res) => {
  await userService.resetPassword(req.body);
  return res.status(200).json({ success: true, message: "Password reset successfully. Please login with your new password." });
});

export const changePassword = catchAsync(async (req, res) => {
  await userService.changePassword(req.user.id, req.body);
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
    path: "/",
  });
  return res.status(200).json({ success: true, message: "Password changed successfully. Please login with your new password." });
});
