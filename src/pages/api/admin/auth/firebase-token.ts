import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminAccess } from '@/lib/auth';
import adminApp, { isFirebaseConfigured } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // 1. Verify our custom admin authentication (cookie/header)
    const user = verifyAdminAccess(req);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // 2. Generate Firebase Custom Token
    try {
        if (!isFirebaseConfigured || !adminApp) {
            return res.status(500).json({ success: false, message: 'Firebase Admin not configured' });
        }

        const auth = getAuth(adminApp);
        // Use a consistent UID for the admin (e.g., 'admin-superuser' or derived from email)
        const adminUid = 'admin-superuser';
        const customToken = await auth.createCustomToken(adminUid, { role: 'admin' });

        return res.status(200).json({ success: true, token: customToken });
    } catch (error) {
        console.error('Error generating Firebase token:', error);
        return res.status(500).json({ success: false, message: 'Failed to generate token' });
    }
}
