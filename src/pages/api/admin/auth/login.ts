import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateAdmin, generateToken, checkRateLimit, recordLoginAttempt } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    const clientIP = req.headers['x-forwarded-for'] as string || req.connection?.remoteAddress || 'unknown';

    // Check rate limiting
    const rateLimit = checkRateLimit(clientIP);
    
    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: `Too many failed attempts. Try again in ${rateLimit.lockoutTime} minutes.`,
        lockoutTime: rateLimit.lockoutTime
      });
    }

    // Validate input
    if (!email || !password) {
      recordLoginAttempt(clientIP, false);
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Authenticate
    const user = await authenticateAdmin(email, password);
    
    if (!user) {
      recordLoginAttempt(clientIP, false);
      const updatedRateLimit = checkRateLimit(clientIP);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        attemptsLeft: updatedRateLimit.attemptsLeft
      });
    }

    // Generate token
    const token = generateToken(user);
    
    // Record successful login
    recordLoginAttempt(clientIP, true);
    
    // Set HTTP-only cookie for better security
    res.setHeader('Set-Cookie', [
      `admin_token=${token}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    ]);

    console.log('Admin login successful:', user.email);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        email: user.email,
        role: user.role
      },
      token // Also return token for client-side storage if needed
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}