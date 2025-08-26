import { NextApiRequest, NextApiResponse } from 'next';
import { Redis } from '@upstash/redis';

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type, ...data } = req.body;

    // Generate a unique ID for the submission
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare the data to store
    const submissionData = {
      id,
      type,
      timestamp: new Date().toISOString(),
      ...data,
    };

    // Store in Upstash Redis
    await redis.set(id, JSON.stringify(submissionData));
    
    // Also add to a list for easy retrieval
    await redis.lpush(`submissions:${type}`, id);
    
    // Set expiration for individual submission (optional - 30 days)
    await redis.expire(id, 30 * 24 * 60 * 60);

    // Send different responses based on type
    if (type === 'message') {
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully! I\'ll get back to you soon.',
        id,
      });
    } else if (type === 'booking') {
      const { date, time, fullName } = data;
      return res.status(200).json({
        success: true,
        message: `Call booked successfully for ${new Date(date).toLocaleDateString()} at ${time}. I'll send you a confirmation email shortly.`,
        id,
        booking: {
          date,
          time,
          name: fullName,
        },
      });
    }

    return res.status(200).json({ success: true, id });
  } catch (error) {
    console.error('Error storing contact submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process your request. Please try again.',
    });
  }
}