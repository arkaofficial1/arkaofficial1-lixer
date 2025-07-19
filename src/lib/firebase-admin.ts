import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;

if (!getApps().length) {
  try {
    if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
      // This path is for environments like Genkit flows where the key is in an env var.
      app = initializeApp({
        credential: cert(JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY))
      });
      console.log("Firebase Admin initialized with GCP_SERVICE_ACCOUNT_KEY.");
    } else {
      // This path is for Google Cloud environments like App Hosting (default credentials).
      app = initializeApp();
      console.log("Firebase Admin initialized with default credentials.");
    }
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
    // If initialization fails, we can't proceed.
    // Throwing an error might be appropriate in a real app to halt execution.
  }
} else {
  // If already initialized, get the default app.
  app = getApps()[0];
}

const db = getFirestore(app);

export { db };
