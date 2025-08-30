import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, isFirebaseConfigured } from '@/lib/firebase-admin';
import { Submission } from '@/types/admin';
import { verifyAdminAccess } from '@/lib/auth';

// Import fallback submissions
let fallbackSubmissions: Submission[] = [];

// Try to import from contact API
try {
  const contactModule = require('../contact');
  if (contactModule.fallbackSubmissions) {
    fallbackSubmissions = contactModule.fallbackSubmissions;
  }
} catch (error) {
  console.warn('Could not import fallback submissions from contact API');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify admin access for all methods
  const user = verifyAdminAccess(req);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Admin access required.'
    });
  }

  console.log('Admin API access by:', user.email);

  if (req.method === 'GET') {
    try {
      const { type } = req.query;
      let submissions: Submission[] = [];

      if (isFirebaseConfigured && adminDb) {
        // Use Firebase
        console.log('Fetching submissions from Firebase');
        let query = adminDb.collection('submissions').orderBy('timestamp', 'desc');
        
        // Filter by type if specified
        if (type && (type === 'message' || type === 'booking')) {
          query = query.where('type', '==', type);
        }
        
        const snapshot = await query.get();
        
        snapshot.forEach((doc: any) => {
          submissions.push(doc.data() as Submission);
        });
      } else {
        // Use fallback storage
        console.log('Fetching submissions from fallback storage');
        // Re-import to get latest data
        try {
          delete require.cache[require.resolve('../contact')];
          const contactModule = require('../contact');
          if (contactModule.fallbackSubmissions) {
            fallbackSubmissions = contactModule.fallbackSubmissions;
          }
        } catch (error) {
          console.warn('Could not re-import fallback submissions');
        }
        
        submissions = [...fallbackSubmissions];
        
        // Filter by type if specified
        if (type && (type === 'message' || type === 'booking')) {
          submissions = submissions.filter(s => s.type === type);
        }
        
        // Sort by timestamp descending
        submissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
      
      console.log(`Found ${submissions.length} submissions`);
      return res.status(200).json({ success: true, submissions });
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch submissions',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined,
      });
    }
  }
  
  if (req.method === 'PATCH') {
    try {
      const { id } = req.query;
      const updates = req.body;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid submission ID',
        });
      }

      if (isFirebaseConfigured && adminDb) {
        // Update in Firebase
        await adminDb.collection('submissions').doc(id).update({
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Update in fallback storage
        console.log('Updating submission in fallback storage:', id);
        
        // Re-import to get latest data
        try {
          delete require.cache[require.resolve('../contact')];
          const contactModule = require('../contact');
          if (contactModule.fallbackSubmissions) {
            const index = contactModule.fallbackSubmissions.findIndex((s: Submission) => s.id === id);
            if (index !== -1) {
              contactModule.fallbackSubmissions[index] = {
                ...contactModule.fallbackSubmissions[index],
                ...updates,
                updatedAt: new Date().toISOString(),
              };
            }
          }
        } catch (error) {
          console.warn('Could not update in fallback storage');
        }
      }
      
      return res.status(200).json({
        success: true,
        message: 'Submission updated successfully',
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update submission',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined,
      });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}