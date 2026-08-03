const express = require('express');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const auth = require('../controllers/authController');

const router = express.Router();

router.post('/register', auth.registerValidators, validate, auth.register);
router.post('/login', auth.loginValidators, validate, auth.login);
router.post('/logout', auth.logout);
router.post('/forgot-password', auth.forgotPasswordValidators, validate, auth.forgotPassword);
router.post('/reset-password/:token', auth.resetPasswordValidators, validate, auth.resetPassword);
router.put('/change-password', protect, auth.changePasswordValidators, validate, auth.changePassword);
router.get('/me', protect, auth.me);
router.put('/profile', protect, auth.updateProfile);

module.exports = router;
