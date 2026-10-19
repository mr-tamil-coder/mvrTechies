const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  getAllUsers,
  generateSignupOtp,
  verifySignupOtp,
  forgotPasswordOtp,
  resetPasswordOtp,
  changePasswordDirect
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Standard auth
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getProfile);
router.get('/users', getAllUsers);

// Direct Password Change (Old Password + New Password)
router.post('/change-password', changePasswordDirect);

// Legacy/Optional OTP routes
router.post('/generate-signup-otp', generateSignupOtp);
router.post('/verify-signup-otp', verifySignupOtp);
router.post('/forgot-password-otp', forgotPasswordOtp);
router.post('/reset-password-otp', resetPasswordOtp);

module.exports = router;

