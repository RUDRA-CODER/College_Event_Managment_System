export const getPasswordResetEmail = (name: string, otp: string) => {
  return {
    subject: 'Password Reset Request - CKPCET Events Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #333;">Hello, ${name}</h2>
        <p style="color: #555; line-height: 1.5;">
          We received a request to reset your password. Use the OTP below to proceed with the password reset.
        </p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 4px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #555; line-height: 1.5;">
          This code will expire in 10 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.
        </p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="color: #888; font-size: 12px; text-align: center;">
          CKPCET Events Portal &copy; ${new Date().getFullYear()}
        </p>
      </div>
    `,
    text: `Hello ${name}. Your password reset OTP is: ${otp}. It will expire in 10 minutes.`,
  };
};
