'use server';

import { db } from '@/lib/firebase-admin';
import { format } from 'date-fns';

export interface Link {
    id: string;
    originalUrl: string;
    shortCode: string;
    clicks: number;
    createdAt: string; // We'll format the timestamp to a string
}

export async function getLinks(): Promise<Link[]> {
  try {
    // In the future, we'll filter this by user ID
    const linksCollection = db.collection('links');
    const snapshot = await linksCollection.orderBy('createdAt', 'desc').get();
    
    if (snapshot.empty) {
      return [];
    }
    
    const links: Link[] = snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt;
        let formattedDate = 'N/A';

        // Firestore timestamp can be null or a Timestamp object
        if (createdAt && typeof createdAt.toDate === 'function') {
           formattedDate = format(createdAt.toDate(), 'yyyy-MM-dd');
        } else if (createdAt) {
          // Fallback for string or number dates if any, though less likely with serverTimestamp
           try {
             const d = new Date(createdAt);
             if (!isNaN(d.getTime())) {
                formattedDate = format(d, 'yyyy-MM-dd');
             }
           } catch (e) {
             // Ignore if date is not valid
           }
        }

        return {
            id: doc.id,
            originalUrl: data.originalUrl || '',
            shortCode: data.shortCode || '',
            clicks: data.clicks || 0,
            createdAt: formattedDate,
        };
    });

    return links;
  } catch (error) {
    console.error("Error getting documents from Firestore:", error);
    // Return an empty array or handle the error as appropriate
    return [];
  }
}
