import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  bcc?: string[];
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (options: SendEmailOptions) => {
  try {
    const isBulk = Array.isArray(options.to);
    const toField = isBulk ? process.env.SMTP_FROM || '"CKPCET Events" <noreply@ckpcet.ac.in>' : options.to;
    const bccField = isBulk ? options.to : options.bcc;

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"CKPCET Events" <noreply@ckpcet.ac.in>',
      to: toField,
      bcc: bccField,
      subject: options.subject,
      text: options.text || '',
      html: options.html,
    });
    
    console.log(`Email sent successfully. MessageId: ${info.messageId}. Bulk: ${isBulk}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error sending email:', error.message || error);
    return { success: false, error: error.message || error };
  }
};
