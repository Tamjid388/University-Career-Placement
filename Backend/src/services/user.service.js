import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generatetoken.js";
import { sendEmail } from "../utils/mailer.js";
import { HttpError } from "../utils/httpError.js";

const RESET_TOKEN_EXPIRY_MS = 30 * 60 * 1000;
const GENERIC_FORGOT_MESSAGE = "If an account exists for this email, a reset link has been sent.";

export const register = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (!password) {
      return { user: existingUser, token: generateToken(existingUser), existing: true };
    }
    throw new HttpError(400, "User already exists. Please log in.");
  }
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  const newUser = new User({ name, email, password: hashedPassword, role: role || "job-seeker" });
  await newUser.save();
  return { user: newUser, token: generateToken(newUser), existing: false };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new HttpError(400, "Invalid email or password");
  if (!user.password) {
    throw new HttpError(400, "This account uses Google Sign-In. Please login with Google.");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new HttpError(400, "Invalid email or password");
  return { user, token: generateToken(user) };
};

export const updateProfile = async (userId, data) => {
  const updatedUser = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!updatedUser) throw new HttpError(404, "User not found");
  return updatedUser;
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new HttpError(404, "User not found");
  return user;
};

export const getAllUsersData = async () => User.find().select("-password");

export const forgotPassword = async (email) => {
  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user || !user.password) return GENERIC_FORGOT_MESSAGE;
  const rawToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
  await user.save({ validateBeforeSave: false });
  const frontendBase = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
  const resetLink = `${frontendBase}/reset-password?token=${rawToken}&email=${encodeURIComponent(normalizedEmail)}`;
  try {
    await sendEmail(
      normalizedEmail,
      "Reset your University Job Hub password",
      `Hi ${user.name || "there"},\n\nYou requested a password reset. Click the link below within 30 minutes:\n\n${resetLink}\n\nIf you did not request this, you can ignore this email.\nUniversity Job Hub`
    );
  } catch {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new HttpError(500, "Failed to send reset email. Please try again later.");
  }
  return GENERIC_FORGOT_MESSAGE;
};

export const resetPassword = async ({ email, token, newPassword }) => {
  const hashedToken = crypto.createHash("sha256").update(String(token)).digest("hex");
  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({
    email: normalizedEmail,
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+password +resetPasswordToken +resetPasswordExpires");
  if (!user) throw new HttpError(400, "Reset link is invalid or has expired. Please request a new one.");
  user.password = await bcrypt.hash(String(newPassword), 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save({ validateBeforeSave: false });
  return true;
};

export const changePassword = async (userId, { oldPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new HttpError(404, "User not found.");
  if (!user.password) {
    throw new HttpError(400, "This account uses Google Sign-In and has no password to change.");
  }
  const isMatch = await bcrypt.compare(String(oldPassword), user.password);
  if (!isMatch) throw new HttpError(400, "Old password is incorrect.");
  user.password = await bcrypt.hash(String(newPassword), 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save({ validateBeforeSave: false });
  return true;
};
