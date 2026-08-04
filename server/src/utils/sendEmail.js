const nodemailer = require('nodemailer');

const cleanPass = (value = '') =>
  String(value)
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\s+/g, '');

let cachedTransporter = null;
let cachedKey = '';

const getMailConfig = () => {
  const user = (process.env.SMTP_USER || '').trim();
  const pass = cleanPass(process.env.SMTP_PASS || '');
  return { user, pass };
};

const getTransporter = () => {
  const { user, pass } = getMailConfig();
  if (!user || !pass) return null;

  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = port === 465 || String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';
  const key = `${user}:${pass}:${host}:${port}:${secure}`;

  if (cachedTransporter && cachedKey === key) return cachedTransporter;

  cachedKey = key;
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 45000,
    requireTLS: !secure,
    tls: { minVersion: 'TLSv1.2' },
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

const resolveFrom = (user) => {
  const configuredFrom = (process.env.MAIL_FROM || '').trim().replace(/^["']|["']$/g, '');
  if (configuredFrom && configuredFrom.toLowerCase().includes(user.toLowerCase())) {
    return configuredFrom;
  }
  return `"Lotus Agritech" <${user}>`;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const { user, pass } = getMailConfig();

  if (!user || !pass) {
    console.log(`[email:dev] To: ${to} | ${subject}`);
    return { accepted: [to], preview: true };
  }

  const transporter = getTransporter();

  return withTimeout(
    transporter.sendMail({
      from: resolveFrom(user),
      to,
      subject,
      html,
      text,
    }),
    40000,
    `Email to ${to}`
  );
};

const verifySmtp = async () => {
  const { user, pass } = getMailConfig();
  if (!user || !pass) {
    const err = new Error('SMTP_USER or SMTP_PASS missing on server');
    err.code = 'SMTP_MISSING';
    throw err;
  }

  const transporter = getTransporter();
  await withTimeout(transporter.verify(), 35000, 'SMTP verify');
  return { ok: true, user };
};

module.exports = sendEmail;
module.exports.getTransporter = getTransporter;
module.exports.verifySmtp = verifySmtp;
module.exports.getMailConfig = getMailConfig;
