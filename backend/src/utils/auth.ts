import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '@config/env';
import type { AuthPayload, JwtTokens } from '@types/auth';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateTokens(userId: string, email: string): JwtTokens {
  const accessToken = jwt.sign(
    { userId, email },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId, email },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRY }
  );

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, config.JWT_SECRET) as AuthPayload;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as AuthPayload;
  } catch (error) {
    return null;
  }
}
