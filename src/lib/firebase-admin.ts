import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (server-side)
let app: any = null;
let adminDb: any = null;
let isFirebaseConfigured = false;

try {
  const apps = getApps();
  
  if (apps.length === 0) {
    // Check if we have the required environment variables
    if (!process.env.FIREBASE_PROJECT_ID || 
        !process.env.FIREBASE_CLIENT_EMAIL || 
        !process.env.FIREBASE_PRIVATE_KEY ||
        process.env.FIREBASE_CLIENT_EMAIL.includes('xxxxx') ||
        process.env.FIREBASE_PRIVATE_KEY.includes('Your private key here')) {
      
      console.warn('Firebase Admin environment variables not properly configured');
      console.warn('Using fallback storage. Please configure Firebase service account for production.');
      isFirebaseConfigured = false;
    } else {
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      
      adminDb = getFirestore(app);
      isFirebaseConfigured = true;
      console.log('Firebase Admin initialized successfully');
    }
  } else {
    app = getApp();
    adminDb = getFirestore(app);
    isFirebaseConfigured = true;
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  console.warn('Falling back to in-memory storage');
  isFirebaseConfigured = false;
}

export { adminDb, isFirebaseConfigured };
export default app;