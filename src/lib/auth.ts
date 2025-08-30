import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Admin credentials (in production, these should be in environment variables)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ettouzany.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "$2b$12$YNOUdhyJJnIuWlhWiPLeXuxeU7rOIKyo2cB7Ro1c1NA6uYSbYRW4."; // Default: 'admin123'
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

export interface AdminUser {
  email: string;
  role: 'admin';
  loginTime: number;
}

// Verify password
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};

// Hash password (for setup/changing passwords)
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

// Generate JWT token
export const generateToken = (user: AdminUser): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
};

// Verify JWT token
export const verifyToken = (token: string): AdminUser | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    
    // Check if token is expired based on login time
    if (Date.now() - decoded.loginTime > SESSION_TIMEOUT) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
};

// Authenticate admin login
export const authenticateAdmin = async (email: string, password: string): Promise<AdminUser | null> => {
  // Check email
  if (email !== ADMIN_EMAIL) {
    return null;
  }
  
  // Verify password
  const isValid = await verifyPassword(password, ADMIN_PASSWORD_HASH);
  if (!isValid) {
    return null;
  }
  
  return {
    email: ADMIN_EMAIL,
    role: 'admin',
    loginTime: Date.now(),
  };
};

// Extract token from request
export const getTokenFromRequest = (req: NextApiRequest): string | null => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies.admin_token;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  
  if (cookieToken) {
    return cookieToken;
  }
  
  return null;
};

// Verify admin access
export const verifyAdminAccess = (req: NextApiRequest): AdminUser | null => {
  const token = getTokenFromRequest(req);
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
};

// Rate limiting for login attempts
const loginAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export const checkRateLimit = (ip: string): { allowed: boolean; attemptsLeft?: number; lockoutTime?: number } => {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  
  if (!attempts) {
    loginAttempts.set(ip, { count: 0, lastAttempt: now });
    return { allowed: true };
  }
  
  // Reset if lockout time has passed
  if (now - attempts.lastAttempt > LOCKOUT_TIME) {
    loginAttempts.set(ip, { count: 0, lastAttempt: now });
    return { allowed: true };
  }
  
  // Check if locked out
  if (attempts.count >= MAX_ATTEMPTS) {
    const remainingTime = LOCKOUT_TIME - (now - attempts.lastAttempt);
    return { 
      allowed: false, 
      lockoutTime: Math.ceil(remainingTime / 1000 / 60) // minutes
    };
  }
  
  return { 
    allowed: true, 
    attemptsLeft: MAX_ATTEMPTS - attempts.count 
  };
};

export const recordLoginAttempt = (ip: string, success: boolean) => {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: now };
  
  if (success) {
    // Reset on successful login
    loginAttempts.delete(ip);
  } else {
    // Increment failed attempts
    loginAttempts.set(ip, {
      count: attempts.count + 1,
      lastAttempt: now
    });
  }
};