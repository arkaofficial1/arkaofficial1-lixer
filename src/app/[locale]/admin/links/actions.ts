
'use server';

import { db } from '@/lib/firebase-admin';
import { format } from 'date-fns';
import { revalidatePath } from 'next/cache';

// Matches the database schema proposal
export interface Link {
    originalUrl: string;
    shortCode: string;
    clicks: number;
    createdAt: string; // Formatted for display
}

export interface LinkWithId extends Link {
    id: string;
}

export async function getAllLinks(): Promise<LinkWithId[]> {
  try {
    const linksCollection = db.collection('links');
    const snapshot = await linksCollection.orderBy('createdAt', 'desc').get();
    
    if (snapshot.empty) {
      return [];
    }
    
    const links: LinkWithId[] = snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt;
        let formattedDate = 'N/A';

        // Firestore timestamp can be null or a Timestamp object
        if (createdAt && typeof createdAt.toDate === 'function') {
           formattedDate = format(createdAt.toDate(), 'yyyy-MM-dd HH:mm');
        } else if (createdAt) {
          // Fallback for string or number dates if any
           try {
             const d = new Date(createdAt);
             if (!isNaN(d.getTime())) {
                formattedDate = format(d, 'yyyy-MM-dd HH:mm');
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
    console.error("Error getting all links from Firestore:", error);
    return [];
  }
}

export async function deleteLink(id: string) {
    try {
        await db.collection('links').doc(id).delete();
        revalidatePath('/admin/links');
        return { success: true };
    } catch (error) {
        console.error("Error deleting link from Firestore:", error);
        return { success: false, error: "Could not delete the link." };
    }
}
