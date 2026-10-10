export const getStudentVerificationEmail = (name: string, otp: string) => {
  return {
    subject: 'Verify your email for CKPCET Events Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #333;">Welcome to CKPCET Events, ${name}!</h2>
        <p style="color: #555; line-height: 1.5;">
          Thank you for signing up. Please use the verification code below to activate your account.
        </p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 4px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #555; line-height: 1.5;">
          This code will expire in 5 minutes. If you did not request this, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="color: #888; font-size: 12px; text-align: center;">
          CKPCET Events Portal &copy; ${new Date().getFullYear()}
        </p>
      </div>
    `,
    text: `Welcome ${name}! Your verification code is: ${otp}. It will expire in 5 minutes.`,
  };
};
