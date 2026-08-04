const nodemailer = require('nodemailer');

const cleanPass = (value = '') =>
  String(value)
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\s+/g, '');

let cachedTransporter = null;
let cachedKey = '';

const getTransporter = () => {
  const user = (process.env.SMTP_USER || '').trim();
  const pass = cleanPass(process.env.SMTP_PASS || '');
  if (!user || !pass) return null;

  const key = `${user}:${pass}`;
  if (cachedTransporter && cachedKey === key) return cachedTransporter;

  cachedKey = key;
  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    tls: { rejectUnauthorized: true },
  });

  return cachedTransporter;
};

const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    }),
  ]);

const sendEmail = async ({ to, subject, html, text }) => {
  const user = (process.env.SMTP_USER || '').trim();
  const pass = cleanPass(process.env.SMTP_PASS || '');

  if (!user || !pass) {
    console.log(`[email:dev] To: ${to} | ${subject}`);
    return { accepted: [to], preview: true };
  }

  const transporter = getTransporter();
  const configuredFrom = (process.env.MAIL_FROM || '').trim();
  const from =
    configuredFrom && configuredFrom.toLowerCase().includes(user.toLowerCase())
      ? configuredFrom
      : `"Lotus Agritech" <${user}>`;

  return withTimeout(
    transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    }),
    25000,
    `Email to ${to}`
  );
};

module.exports = sendEmail;
module.exports.getTransporter = getTransporter;
