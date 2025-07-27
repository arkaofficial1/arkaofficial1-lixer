'use server';

import { db } from '@/lib/firebase-admin';
import { format } from 'date-fns';

export interface Link {
    originalUrl: string;
    shortCode: string;
    clicks: number;
    createdAt: string; 
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

        if (createdAt && typeof createdAt.toDate === 'function') {
           formattedDate = format(createdAt.toDate(), 'yyyy-MM-dd');
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
