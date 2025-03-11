import express from 'express';
import { getUserProfile, isAuthenticated, login, logout,resetPassword, register,sendResetOtp, sendVerifyOtp, updateUserProfile, verifyEmail } from '../controllers/userControllers.js';
import { verifyToken } from '../middleware/auth.js';
import { validateLogin, validateSignup } from '../middleware/validators.js';
import { singleUpload } from '../middleware/upload.js';
const router = express.Router();

router.post('/register',validateSignup, register);
router.post('/login',validateLogin, login);
router.get('/profile', verifyToken, getUserProfile);
router.put('/update-profile', singleUpload, verifyToken, updateUserProfile); // Add singleUpload middleware
router.post("/send-verify-otp",verifyToken, sendVerifyOtp)
router.post("/verify-account",verifyToken, verifyEmail)
router.post("/is-auth",verifyToken, isAuthenticated)
router.post("/send-reset-otp", sendResetOtp)
router.post("/reset-password",resetPassword)
router.post("/logout", logout);


export default router;