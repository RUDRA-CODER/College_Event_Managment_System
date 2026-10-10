process.env.SMTP_HOST = 'smtp.ethereal.email';
process.env.SMTP_PORT = '587';
process.env.SMTP_USER = 'o6hxlebgtomdfxqw@ethereal.email';
process.env.SMTP_PASSWORD = 'hUB5H24StHUXNv23q3';
process.env.SMTP_FROM = '"CKPCET Events" <noreply@ckpcet.ac.in>';

import { sendEmail } from './services/emailService';

sendEmail({
  to: 'test@example.com',
  subject: 'SMTP Verification',
  html: '<h1>Hello! Email delivery is working.</h1>'
})
  .then(res => {
    console.log(res);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
