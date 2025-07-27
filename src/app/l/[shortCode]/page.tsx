import { db } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { notFound } from 'next/navigation';

async function getLinkAndIncrementClicks(shortCode: string): Promise<string | null> {
  try {
    const linkDocRef = db.collection('links').doc(shortCode);
    const docSnap = await linkDocRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();

      // Check for expiration
      if (data?.expiresAt && data.expiresAt instanceof Timestamp) {
        const expirationDate = data.expiresAt.toDate();
        if (expirationDate < new Date()) {
          console.log(`Link ${shortCode} has expired.`);
          // Optionally, you could delete the link here
          // await linkDocRef.delete();
          return null; // Treat as not found
        }
      }

      // Atomically increment the click count in the background.
      // We don't need to wait for this to complete before redirecting.
      linkDocRef.update({
          clicks: FieldValue.increment(1)
      }).catch(err => console.error("Failed to increment clicks:", err));
      
      return data?.originalUrl;
    } else {
      console.log("No such document for shortCode:", shortCode);
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

  const originalUrl = await getLinkAndIncrementClicks(shortCode);

  if (originalUrl) {
    // Perform the redirect
    redirect(originalUrl);
  } else {
    // If the link is not found or expired, show the standard 404 page.
    notFound();
  }
}
