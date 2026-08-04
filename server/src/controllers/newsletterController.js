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

  const smtpReady = Boolean(
    (process.env.SMTP_USER || '').trim() && (process.env.SMTP_PASS || '').trim()
  );

  if (!smtpReady) {
    return res.status(503).json({
      success: false,
      message: 'Email is not configured on the server. Please contact the developer.',
    });
  }

  // Fail fast if Gmail login is broken (instead of hanging forever)
  try {
    const transporter = sendEmail.getTransporter();
    if (transporter) {
      await Promise.race([
        transporter.verify(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('SMTP verify timed out')), 12000)
        ),
      ]);
    }
  } catch (err) {
    console.error('[newsletter] SMTP verify failed:', err.message);
    return res.status(502).json({
      success: false,
      message: 'Could not connect to Gmail. Check App Password and try again.',
    });
  }

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

  const results = { sent: 0, failed: 0, errors: [] };

  // Send one-by-one (Gmail-friendly) with per-mail timeout inside sendEmail
  for (const sub of subscribers) {
    try {
      const result = await sendEmail({
        to: sub.email,
        subject,
        html,
        text: message,
      });
      if (result?.preview) {
        results.failed += 1;
        results.errors.push({ email: sub.email, error: 'Email preview only' });
      } else {
        results.sent += 1;
        console.log(`[newsletter] sent → ${sub.email}`);
      }
    } catch (err) {
      console.error(`[newsletter] fail → ${sub.email}:`, err.message);
      results.failed += 1;
      results.errors.push({ email: sub.email, error: err.message });
    }
  }

  if (results.sent === 0) {
    return res.status(502).json({
      success: false,
      data: { total: subscribers.length, ...results },
      message: 'Could not send emails. Please try again in a minute.',
    });
  }

  res.json({
    success: true,
    data: {
      total: subscribers.length,
      ...results,
    },
    message:
      results.failed > 0
        ? `Sent to ${results.sent} subscriber(s), ${results.failed} failed.`
        : `Email sent successfully to ${results.sent} subscriber(s).`,
  });
});
