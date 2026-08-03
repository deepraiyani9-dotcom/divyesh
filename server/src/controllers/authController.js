const crypto = require('crypto');
const { body } = require('express-validator');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

exports.registerValidators = [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
];

exports.loginValidators = [body('email').isEmail(), body('password').notEmpty()];

exports.forgotPasswordValidators = [body('email').isEmail()];

exports.resetPasswordValidators = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.changePasswordValidators = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

exports.register = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

  const user = await User.create(req.body);
  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.matchPassword(req.body.password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});

exports.logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const updates = {
    name: req.body.name ?? req.user.name,
    phone: req.body.phone ?? req.user.phone,
    avatar: req.body.avatar ?? req.user.avatar,
  };

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json({ success: true, user });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  const user = await User.findOne({ email });

  const generic = {
    success: true,
    message: 'If that email exists, a password reset link has been sent.',
  };

  if (!user) return res.json(generic);

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  const resetUrl = `${clientUrl}/admin/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Reset your Lotus Agritech admin password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#2C3340">
        <h2 style="color:#0D7377">Password reset</h2>
        <p>Hi ${user.name},</p>
        <p>We received a request to reset your admin password. Click the button below. This link expires in <strong>30 minutes</strong>.</p>
        <p style="margin:24px 0">
          <a href="${resetUrl}" style="background:#0D7377;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">
            Reset Password
          </a>
        </p>
        <p style="font-size:13px;color:#6b7280">If you did not request this, you can ignore this email.</p>
        <p style="font-size:12px;word-break:break-all;color:#6b7280">${resetUrl}</p>
      </div>
    `,
  });

  const response = { ...generic };
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    response.resetUrl = resetUrl;
    response.devHint = 'SMTP not configured — use resetUrl to open the reset page.';
  }

  res.json(response);
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+password +resetPasswordToken +resetPasswordExpire');

  if (!user) {
    return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired' });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.json({
    success: true,
    message: 'Password updated successfully',
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const ok = await user.matchPassword(req.body.currentPassword);
  if (!ok) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

  if (req.body.currentPassword === req.body.newPassword) {
    return res
      .status(400)
      .json({ success: false, message: 'New password must be different from current password' });
  }

  user.password = req.body.newPassword;
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
});
