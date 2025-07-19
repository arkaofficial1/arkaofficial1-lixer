import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// This file centralizes Firebase Admin SDK initialization.
// It handles initialization for different environments (Next.js server vs. Genkit flows).

if (!getApps().length) {
  try {
    // This environment variable is set in Firebase Studio and used by Genkit.
    if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
      initializeApp({
        credential: cert(JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY))
      });
      console.log("Firebase Admin initialized with GCP_SERVICE_ACCOUNT_KEY.");
    } 
    // This is the default for Google Cloud environments like App Hosting.
    else {
      initializeApp();
      console.log("Firebase Admin initialized with default credentials.");
    }
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }
}

const db = getFirestore();

export { db };
