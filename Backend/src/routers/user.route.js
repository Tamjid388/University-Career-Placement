import  express  from 'express';
import { changePassword, forgotPassword, getCurrentUser, login, logout, register, resetPassword, updateUserProfile } from "../controllers/user.controller.js";
import { verifyToken } from './../middlewares/verifytoken.js';
import { googleLogin } from '../controllers/firebaseauth.controller.js';



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
//logout changed to post from get
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/change-password", verifyToken, changePassword);


router.put("/profile/update",verifyToken ,updateUserProfile);


router.get("/me",verifyToken,getCurrentUser)




export default router;
