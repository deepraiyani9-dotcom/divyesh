require('dotenv').config();
const nodemailer = require('nodemailer');

const user = (process.env.SMTP_USER || '').trim();
const raw = process.env.SMTP_PASS || '';
const pass = raw.trim().replace(/^["']|["']$/g, '').replace(/ /g, '');
const from = process.env.MAIL_FROM || '';

console.log('USER:', user);
console.log('PASS raw length:', raw.length);
console.log('PASS cleaned length:', pass.length);
console.log('PASS has spaces:', raw.includes(' '));
console.log('FROM:', from);
console.log('FROM matches USER:', from.toLowerCase().includes(user.toLowerCase()));

if (!user || !pass) {
  console.log('STATUS: missing credentials');
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
  .then(() => console.log('STATUS: SMTP OK - can send'))
  .catch((e) => console.log('STATUS: SMTP FAIL -', (e.message || '').split('\n')[0]));
