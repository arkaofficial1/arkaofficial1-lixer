import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// This file is now primarily for non-Genkit server-side code.
// The main initialization logic has been moved to the Genkit flow and redirect page
// to ensure credentials are available in their respective environments.

if (!getApps().length) {
  try {
    if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
      initializeApp({
        credential: cert(JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY))
      });
    } else {
      initializeApp();
    }
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }
}

const db = getFirestore();

export { db };
