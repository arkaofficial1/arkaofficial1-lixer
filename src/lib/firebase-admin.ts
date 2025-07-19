import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK only if it hasn't been initialized yet.
if (!getApps().length) {
  try {
    if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
      // Production environment: Use service account key from environment variable.
      initializeApp({
        credential: cert(JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY))
      });
    } else {
      // Development environment: Use Application Default Credentials.
      // This requires running `gcloud auth application-default login` locally.
      initializeApp();
    }
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
    // You might want to throw the error or handle it differently depending on your needs.
  }
}

const db = getFirestore();

export { db };
