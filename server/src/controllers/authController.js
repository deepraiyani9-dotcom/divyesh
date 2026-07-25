const { body } = require('express-validator');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

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

  if (req.body.password) {
    req.user.password = req.body.password;
    await req.user.save();
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json({ success: true, user });
});
