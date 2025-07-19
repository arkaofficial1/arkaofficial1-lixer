import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { redirect } from 'next/navigation';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
    initializeApp({
      credential: cert(JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY))
    });
  } else {
    // For local development, it will use application default credentials.
    // Ensure you've run `gcloud auth application-default login`.
    initializeApp();
  }
}

const db = getFirestore();


async function getLink(shortCode: string): Promise<string | null> {
  try {
    const linkDocRef = db.collection('links').doc(shortCode);
    const docSnap = await linkDocRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      // Atomically increment the click count.
      await linkDocRef.update({
          clicks: increment(1)
      });
      return data?.originalUrl;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}


export default async function ShortCodePage({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params;

  if (shortCode === 'favicon.ico') {
    return null;
  }

  const originalUrl = await getLink(shortCode);

  if (originalUrl) {
    redirect(originalUrl);
  } else {
    redirect('/not-found');
  }

  return null; // This will not be rendered because of the redirects.
}
