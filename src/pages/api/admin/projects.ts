import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, isFirebaseConfigured } from '@/lib/firebase-admin';
import { verifyAdminAccess } from '@/lib/auth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Verify admin access for all write methods
    if (['POST', 'PUT', 'DELETE'].includes(req.method || '')) {
        const user = verifyAdminAccess(req);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. Admin access required.'
            });
        }
    }

    if (req.method === 'GET') {
        // Admin can also fetch projects
        const user = verifyAdminAccess(req);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        try {
            if (isFirebaseConfigured && adminDb) {
                const snapshot = await adminDb.collection('projects').orderBy('createdAt', 'desc').get();
                const projects = snapshot.docs.map((doc: any) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                return res.status(200).json({ success: true, projects });
            } else {
                return res.status(500).json({ success: false, message: 'Database not configured' });
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch projects' });
        }
    }

    if (req.method === 'POST') {
        try {
            const projectData = req.body;

            if (isFirebaseConfigured && adminDb) {
                const docRef = await adminDb.collection('projects').add({
                    ...projectData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });

                return res.status(201).json({
                    success: true,
                    message: 'Project created successfully',
                    id: docRef.id
                });
            } else {
                return res.status(500).json({ success: false, message: 'Database not configured' });
            }
        } catch (error) {
            console.error('Error creating project:', error);
            return res.status(500).json({ success: false, message: 'Failed to create project' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const updates = req.body;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ success: false, message: 'Invalid ID' });
            }

            if (isFirebaseConfigured && adminDb) {
                await adminDb.collection('projects').doc(id).update({
                    ...updates,
                    updatedAt: new Date().toISOString(),
                });
                return res.status(200).json({ success: true, message: 'Project updated successfully' });
            } else {
                return res.status(500).json({ success: false, message: 'Database not configured' });
            }
        } catch (error) {
            console.error('Error updating project:', error);
            return res.status(500).json({ success: false, message: 'Failed to update project' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ success: false, message: 'Invalid ID' });
            }

            if (isFirebaseConfigured && adminDb) {
                await adminDb.collection('projects').doc(id).delete();
                return res.status(200).json({ success: true, message: 'Project deleted successfully' });
            } else {
                return res.status(500).json({ success: false, message: 'Database not configured' });
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            return res.status(500).json({ success: false, message: 'Failed to delete project' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
