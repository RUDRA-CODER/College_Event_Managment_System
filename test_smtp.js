const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP connection/auth: FAIL', error.message);
  } else {
    console.log('SMTP connection/auth: PASS');
  }
  process.exit(error ? 1 : 0);
});
