const asyncHandler = require('../utils/asyncHandler');
const Subscriber = require('../models/Subscriber');
const sendEmail = require('../utils/sendEmail');

const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

exports.broadcastNewsletter = asyncHandler(async (req, res) => {
  const subject = String(req.body.subject || '').trim();
  const message = String(req.body.message || '').trim();

  if (!subject || !message) {
    return res.status(400).json({ success: false, message: 'Subject and message are required' });
  }

  const subscribers = await Subscriber.find({ isActive: true }).select('email').lean();
  if (!subscribers.length) {
    return res.status(400).json({ success: false, message: 'No active subscribers found' });
  }

  const smtpReady = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
  const paragraphs = escapeHtml(message)
    .split(/\n+/)
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 12px;line-height:1.6;color:#334155">${p}</p>`)
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#0D7377;margin:0 0 8px">Lotus Agritech</h2>
      <p style="color:#64748b;font-size:13px;margin:0 0 20px">Newsletter update</p>
      ${paragraphs}
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
      <p style="font-size:12px;color:#94a3b8;margin:0">
        You received this because you subscribed on our website.
      </p>
    </div>
  `;

  const results = { sent: 0, failed: 0, preview: !smtpReady, errors: [] };

  for (const sub of subscribers) {
    try {
      await sendEmail({
        to: sub.email,
        subject,
        html,
        text: message,
      });
      results.sent += 1;
    } catch (err) {
      results.failed += 1;
      results.errors.push({ email: sub.email, error: err.message });
    }
  }

  res.json({
    success: true,
    data: {
      total: subscribers.length,
      ...results,
      smtpConfigured: smtpReady,
    },
    message: smtpReady
      ? `Newsletter sent to ${results.sent} subscriber(s)`
      : `SMTP not configured — logged ${results.sent} email(s) to server console only. Set SMTP_USER and SMTP_PASS to send real emails.`,
  });
});
