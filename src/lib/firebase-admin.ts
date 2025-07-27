import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// This function initializes and returns the Firebase Admin app instance.
// It ensures that the app is initialized only once.
function initializeAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  let credentials;
  try {
    if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
      // For environments where the service account key is an env var (e.g., Genkit flows)
      credentials = cert(JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY));
      console.log("Firebase Admin: Initializing with GCP_SERVICE_ACCOUNT_KEY.");
    } else {
      // For Google Cloud environments with default credentials (e.g., App Hosting)
      console.log("Firebase Admin: Initializing with default credentials.");
    }
    return initializeApp(credentials ? { credential: credentials } : undefined);
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
    // Throwing an error is appropriate here as the application cannot function without Firebase.
    throw new Error("Failed to initialize Firebase Admin SDK.");
  }
}

const adminApp = initializeAdminApp();

const db = getFirestore(adminApp);
const auth = getAuth(adminApp);

export { db, auth, adminApp };
