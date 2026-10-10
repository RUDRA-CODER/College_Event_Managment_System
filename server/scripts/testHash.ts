import bcrypt from 'bcryptjs';

const hash = '$2b$10$IbYoHyhqyI0T9z4mRa4VWuYLJLCfP3HyC71ASHlyX5MKubwZ4CLGm';

async function testPasswords() {
  const commonPasswords = ['password', 'password123', 'admin', 'admin123', 'pass123', '123456', 'superadmin'];
  for (const pw of commonPasswords) {
    const match = await bcrypt.compare(pw, hash);
    if (match) {
      console.log('Match found:', pw);
      return;
    }
  }
  console.log('No match found');
}

testPasswords();
