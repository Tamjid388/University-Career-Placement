import bcrypt from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateToken } from './../utils/generatetoken.js';
import { sendEmail } from "../utils/mailer.js";



export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
     
      if (!password) {
        const token = generateToken(existingUser);
        return res.status(200).json({
          success: true,
          message: 'User already exists (logged in)',
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
          },
          token,
        });
      }
      // For password-based registration, return error
      return res.status(400).json({
        success: false,
        message: 'User already exists. Please log in.',
      });
    }

    // Create new user
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Set to null for Google sign-in
      role: role || 'job-seeker',
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
      maxAge: 5 * 24 * 60 * 60 * 1000,
       path: "/",
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};



export const login = async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        if (!user.password) {
            return res.status(400).json({ success: false, message: 'This account uses Google Sign-In. Please login with Google.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate JWT
        const token = generateToken(user);



        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
            maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
             path: "/",
        });


        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token

        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
};


export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
             path: "/",
        });

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully.',
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
        });
    }
};


export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from protect middleware

    const {
      name,
      phone,
      location,
      primaryRole,
      bio,
      skills,
      yearsExperience,
      picture,
      resume,
      education,
      workExperience,
      socialLinks,//socialLinks
      certifications,
      languages,
      projects,
      address,
      dob,
      gender
    } = req.body;


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        location, 
         primaryRole,
        bio,
        skills,
       yearsExperience,
        picture,
        resume,
        education,
        workExperience,
        socialLinks,
        certifications,
        languages,
        projects,
        address,
        dob,
        gender
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user, // Return full user object
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: err.message,
    });
  }
};







export const getuserData = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find()
        .select("-password")
    
        ; // Exclude passwords for security

        return res.status(200).json({
            message: "Users data fetched successfully.",
            loggedInUser: req.user,  // Logged-in user details
            users,  // All users
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


const RESET_TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes
const GENERIC_FORGOT_MESSAGE = "If an account exists for this email, a reset link has been sent.";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    // Always return generic message to prevent email enumeration.
    // Google-only accounts (password == null) get no token email.
    if (!user || !user.password) {
      return res.status(200).json({ success: true, message: GENERIC_FORGOT_MESSAGE });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashedToken;
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
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: "Failed to send reset email. Please try again later." });
    }

    return res.status(200).json({ success: true, message: GENERIC_FORGOT_MESSAGE });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      return res.status(400).json({ success: false, message: "Email, token and new password are required." });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    const hashedToken = crypto.createHash("sha256").update(String(token)).digest("hex");
    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password +resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({ success: false, message: "Reset link is invalid or has expired. Please request a new one." });
    }

    user.password = await bcrypt.hash(String(newPassword), 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({ success: true, message: "Password reset successfully. Please login with your new password." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};


export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Old password and new password are required." });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    if (!user.password) {
      return res.status(400).json({ success: false, message: "This account uses Google Sign-In and has no password to change." });
    }

    const isMatch = await bcrypt.compare(String(oldPassword), user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect." });
    }

    user.password = await bcrypt.hash(String(newPassword), 10);
    // Invalidate any outstanding reset token when password changes
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      path: "/",
    });

    return res.status(200).json({ success: true, message: "Password changed successfully. Please login with your new password." });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};












