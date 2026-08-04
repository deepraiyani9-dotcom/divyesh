const asyncHandler = require('../utils/asyncHandler');
const Subscriber = require('../models/Subscriber');
const sendEmail = require('../utils/sendEmail');

const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const friendlySmtpError = (err) => {
  const msg = String(err?.message || err || '');
  if (/missing/i.test(msg)) {
    return 'Render Environment Variables માં SMTP_USER / SMTP_PASS સેટ નથી. Redeploy કરો.';
  }
  if (/Invalid login|BadCredentials|EAUTH|535/i.test(msg)) {
    return 'Gmail App Password Render પર ખોટું છે. Spaces/quotes વગર 16-digit App Password મૂકો અને Redeploy કરો.';
  }
  if (/timeout|ETIMEDOUT|ECONNECTION|ENOTFOUND/i.test(msg)) {
    return 'Render થી Gmail connect timeout થયું. થોડી વાર પછી ફરી try કરો, અથવા SMTP_PORT=465 અને SMTP_SECURE=true સેટ કરો.';
  }
  return 'Could not connect to Gmail from live server. Check Render SMTP settings and redeploy.';
};

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

  try {
    await sendEmail.verifySmtp();
  } catch (err) {
    console.error('[newsletter] SMTP verify failed:', err.message);
    return res.status(502).json({
      success: false,
      message: friendlySmtpError(err),
      detail: process.env.NODE_ENV === 'production' ? undefined : err.message,
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
    const firstError = results.errors[0]?.error || '';
    return res.status(502).json({
      success: false,
      data: { total: subscribers.length, ...results },
      message: friendlySmtpError(firstError) || 'Could not send emails. Please try again.',
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
