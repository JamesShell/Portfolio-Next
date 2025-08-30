import { NextApiRequest, NextApiResponse } from 'next';
import { Message, Booking } from '@/types/admin';

// In-memory storage (for development/fallback)
let submissions: (Message | Booking)[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Fallback Contact API called with method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    const { type, ...data } = req.body;

    if (!type) {
      console.error('Missing type in request body');
      return res.status(400).json({
        success: false,
        message: 'Missing submission type',
      });
    }

    // Generate a unique ID for the submission
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare the data to store
    let submissionData: Message | Booking;
    
    if (type === 'message') {
      submissionData = {
        id,
        type: 'message',
        timestamp: new Date().toISOString(),
        read: false,
        ...data,
      } as Message;
    } else if (type === 'booking') {
      submissionData = {
        id,
        type: 'booking',
        timestamp: new Date().toISOString(),
        status: 'pending',
        ...data,
      } as Booking;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission type',
      });
    }

    // Store in memory (fallback)
    console.log('Storing in memory:', submissionData);
    submissions.push(submissionData);
    console.log('Successfully stored submission with ID:', id);
    console.log('Total submissions in memory:', submissions.length);

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
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    
    return res.status(500).json({
      success: false,
      message: 'Failed to process your request. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined,
    });
  }
}

// Export submissions for the admin API
export { submissions };