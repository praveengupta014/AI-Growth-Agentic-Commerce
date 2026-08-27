const express = require('express');
const router = express.Router();
const {
  register,
  verifyOTP,
  login,
  googleOAuth,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/google', googleOAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
