import crypto from 'crypto';

export class OTPService {
  /**
   * Generates a secure 6-digit OTP
   */
  static generateOTP(): string {
    const randomInt = crypto.randomInt(0, 1000000);
    return randomInt.toString().padStart(6, '0');
  }

  /**
   * Hashes the OTP for safe storage using standard crypto module (SHA256)
   * Note: We don't use bcrypt for OTPs because OTPs need fast verification and 
   * are short-lived. A fast SHA-256 hash is often preferred.
   * However, to maintain consistency, bcrypt can be used, but crypto is perfectly secure for 6-digits if salted correctly.
   */
  static hashOTP(otp: string): string {
    // A simple HMAC with JWT_SECRET as salt
    return crypto.createHmac('sha256', process.env.JWT_SECRET || 'secret').update(otp).digest('hex');
  }

  /**
   * Validates if the OTP is correct
   */
  static verifyOTP(otp: string, storedHash: string): boolean {
    const hash = this.hashOTP(otp);
    return hash === storedHash;
  }
}
