const { body } = require('express-validator');
const ContactMessage = require('../models/ContactMessage');
const QuoteRequest = require('../models/QuoteRequest');
const Subscriber = require('../models/Subscriber');
const JobApplication = require('../models/JobApplication');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/sendEmail');

exports.contactValidators = [
  body('name').trim().notEmpty(),
  body('phone').trim().notEmpty(),
  body('email').isEmail(),
  body('message').trim().notEmpty(),
];

exports.quoteValidators = [
  body('name').trim().notEmpty(),
  body('phone').trim().notEmpty(),
  body('email').isEmail(),
];

exports.submitContact = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create(req.body);

  await sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@lotusagritech.com',
    subject: `New Contact Enquiry — ${message.name}`,
    html: `<p><strong>${message.name}</strong> (${message.email} / ${message.phone})</p><p>${message.message}</p>`,
  });

  res.status(201).json({ success: true, data: message, message: 'Message sent successfully' });
});

exports.submitQuote = asyncHandler(async (req, res) => {
  const quote = await QuoteRequest.create(req.body);

  await sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@lotusagritech.com',
    subject: `New Quote Request — ${quote.name}`,
    html: `<p><strong>${quote.name}</strong> (${quote.email} / ${quote.phone})</p><p>${quote.message || ''}</p>`,
  });

  res.status(201).json({ success: true, data: quote, message: 'Quote request submitted' });
});

exports.subscribe = asyncHandler(async (req, res) => {
  const email = req.body.email?.toLowerCase()?.trim();
  if (!email) return res.status(400).json({ success: false, message: 'Email required' });
  const subscriber = await Subscriber.findOneAndUpdate(
    { email },
    { email, isActive: true },
    { upsert: true, new: true }
  );
  res.status(201).json({ success: true, data: subscriber });
});

exports.applyJob = asyncHandler(async (req, res) => {
  const application = await JobApplication.create({
    ...req.body,
    resumeUrl: req.file ? `/uploads/${req.file.filename}` : req.body.resumeUrl,
  });
  res.status(201).json({ success: true, data: application });
});
