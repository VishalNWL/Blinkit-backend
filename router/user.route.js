import { Router } from "express";
import { currentUser, forgotPassword, loginController, logoutController, refreshToken, registerUserController, resetpassword, updateuser, uploadAvatar, verifyEmailController, verifyForgotPasswordOtp } from "../controller/user.controller.js";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";


const router= Router();

router.post('/register',registerUserController)
router.post('/verify-email',verifyEmailController)
router.post('/login',loginController)
router.post('/logout',auth,logoutController)
router.put('/upload-avatar',upload.single('avatar'),auth,uploadAvatar)
router.put('/update-user',auth,updateuser)
router.put('/forgot-password',forgotPassword);
router.put('/verify-forgot-password-otp',verifyForgotPasswordOtp);
router.put('/resetpassowrd',resetpassword);
router.post('/refreshtoken',refreshToken);
router.get('/user-detail',auth,currentUser)

export default router