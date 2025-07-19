import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { redirect } from 'next/navigation';
import { FieldValue } from 'firebase-admin/firestore';
import { notFound } from 'next/navigation';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
    initializeApp({
      credential: cert(JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY))
    });
  } else {
    // For local development, it will use application default credentials.
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
          clicks: FieldValue.increment(1)
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


export default async function ShortCodeRedirectPage({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params;

  if (!shortCode) {
    notFound();
  }

  const originalUrl = await getLink(shortCode);

  if (originalUrl) {
    redirect(originalUrl);
  } else {
    // In a real app, you might want a specific "link not found" page.
    // For now, we redirect to the main not-found page.
    notFound();
  }

  // This part is never reached due to the redirects, but it's good practice
  // to have a return statement.
  return null;
}
