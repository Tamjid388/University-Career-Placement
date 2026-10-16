import express from 'express';
import { changePassword, forgotPassword, getCurrentUser, login, logout, register, resetPassword, updateUserProfile } from "../controllers/user.controller.js";
import { verifyToken } from './../middlewares/verifytoken.js';
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema, googleLoginSchema } from "../validations/auth.schema.js";
import { forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, updateProfileSchema } from "../validations/user.schema.js";
import { googleLogin } from '../controllers/firebaseauth.controller.js';

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google-login", validate(googleLoginSchema), googleLogin);
//logout changed to post from get
router.post("/logout", logout);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.put("/change-password", verifyToken, validate(changePasswordSchema), changePassword);

router.put("/profile/update", verifyToken, validate(updateProfileSchema), updateUserProfile);

router.get("/me", verifyToken, getCurrentUser);

export default router;
