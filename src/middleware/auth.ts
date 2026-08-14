import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getOrCreateUser } from '../db/queries.ts';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  userIdString?: string;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token header' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    req.userIdString = decodedToken.email || decodedToken.uid;
    // Auto-sync user into database
    await getOrCreateUser(decodedToken.uid, decodedToken.email, decodedToken.name);
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.user = decodedToken;
      req.userIdString = decodedToken.email || decodedToken.uid;
      // Auto-sync user into database
      await getOrCreateUser(decodedToken.uid, decodedToken.email, decodedToken.name);
    } catch (error) {
      console.warn('Optional auth token validation failed, continuing as guest:', error);
      req.userIdString = 'guest_user';
    }
  } else {
    req.userIdString = (req.headers['x-user-id'] as string) || 'admin_user';
  }
  next();
};
