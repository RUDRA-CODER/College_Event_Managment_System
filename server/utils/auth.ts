import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  console.error('CRITICAL: JWT_SECRET environment variable is missing.');
  process.exit(1);
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET as string,
    { expiresIn: JWT_EXPIRES_IN as any }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET as string);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
