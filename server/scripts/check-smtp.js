require('dotenv').config();
const nodemailer = require('nodemailer');

const user = (process.env.SMTP_USER || '').trim();
const pass = String(process.env.SMTP_PASS || '')
  .trim()
  .replace(/^["']|["']$/g, '')
  .replace(/\s+/g, '');

console.log('USER:', user);
console.log('PASS length:', pass.length);
console.log('Looks like App Password (16 chars):', pass.length === 16 && /^[a-zA-Z0-9]+$/.test(pass));

if (!user || !pass) {
  console.log('STATUS: missing');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user, pass },
});

transporter
  .verify()
  .then(() => console.log('STATUS: SMTP OK'))
  .catch((e) => console.log('STATUS: SMTP FAIL -', (e.message || '').split('\n')[0]));
