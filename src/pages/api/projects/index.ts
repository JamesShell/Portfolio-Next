import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, isFirebaseConfigured } from '@/lib/firebase-admin';
import { projects as defaultProjects } from '@/constants';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            if (isFirebaseConfigured && adminDb) {
                const snapshot = await adminDb.collection('projects').orderBy('createdAt', 'desc').get();

                if (snapshot.empty) {
                    // Return default projects if DB is empty
                    return res.status(200).json({ success: true, projects: [] }); // Or defaultProjects mapped
                }

                const projects = snapshot.docs.map((doc: any) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                return res.status(200).json({ success: true, projects });
            } else {
                // Fallback to constants if DB not configured
                // We need to shape it similar to DB response
                return res.status(200).json({
                    success: true,
                    projects: defaultProjects.map((p, i) => ({ ...p, id: `static-${i}` }))
                });
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            // Fallback on error
            return res.status(200).json({
                success: true,
                projects: defaultProjects.map((p, i) => ({ ...p, id: `static-${i}` }))
            });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
