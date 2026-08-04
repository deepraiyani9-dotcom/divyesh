const nodemailer = require('nodemailer');

const cleanPass = (value = '') =>
  String(value)
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\s+/g, '');

const sendEmail = async ({ to, subject, html, text }) => {
  const user = (process.env.SMTP_USER || '').trim();
  const pass = cleanPass(process.env.SMTP_PASS || '');

  if (!user || !pass) {
    console.log(`[email:dev] To: ${to} | ${subject}`);
    return { accepted: [to], preview: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user, pass },
  });

  // Gmail requires From to be the logged-in mailbox (or verified alias)
  const configuredFrom = (process.env.MAIL_FROM || '').trim();
  const from =
    configuredFrom && configuredFrom.toLowerCase().includes(user.toLowerCase())
      ? configuredFrom
      : `"Lotus Agritech" <${user}>`;

  return transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
};

module.exports = sendEmail;
