import * as jwt from 'jsonwebtoken';

export function generateAuthToken(
    userId: number,
): string {
  const secret = "cc4d95ecabeb19a8c8ed9a3619ae87f2e887197f78a8baf09e0dc29785e0db69";

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign({ userId }, secret, { expiresIn: '2h' });
}

const testUserId = 1; 
const token = generateAuthToken(testUserId);
console.log('Test JWT Token:', token);