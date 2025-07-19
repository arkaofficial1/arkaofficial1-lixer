'use server';
/**
 * @fileOverview A flow for shortening URLs and saving them to Firestore.
 *
 * - shortenUrl - A function that handles the URL shortening process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK only if it hasn't been initialized yet.
// This is necessary because Genkit flows run in a separate context.
if (!getApps().length) {
  try {
    // This environment variable is set in Firebase Studio.
    if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
      initializeApp({
        credential: cert(JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY))
      });
    } else {
      // Fallback for local development if GOOGLE_APPLICATION_CREDENTIALS is set.
      initializeApp();
    }
  } catch (error) {
    console.error("Firebase Admin Initialization Error in Flow:", error);
  }
}

const db = getFirestore();

const ShortenUrlInputSchema = z.object({
  url: z.string().url().describe('The long URL to shorten.'),
});
type ShortenUrlInput = z.infer<typeof ShortenUrlInputSchema>;

const ShortenUrlOutputSchema = z.object({
  shortCode: z.string().describe('The generated short code for the URL.'),
});
type ShortenUrlOutput = z.infer<typeof ShortenUrlOutputSchema>;

export async function shortenUrl(input: ShortenUrlInput): Promise<ShortenUrlOutput> {
  return await shortenUrlFlow(input);
}

const shortenUrlFlow = ai.defineFlow(
  {
    name: 'shortenUrlFlow',
    inputSchema: ShortenUrlInputSchema,
    outputSchema: ShortenUrlOutputSchema,
  },
  async (input) => {
    // Generate a random 6-character code.
    const shortCode = Math.random().toString(36).substring(2, 8);
    
    // Save to Firestore
    try {
      const linkDocRef = db.collection('links').doc(shortCode);
      await linkDocRef.set({
        originalUrl: input.url,
        shortCode: shortCode,
        clicks: 0,
        createdAt: FieldValue.serverTimestamp(),
        // In the future, we can add a userId here
      });
    } catch (error) {
      console.error("Error saving link to Firestore:", error);
      // In a real app, you'd want more robust error handling.
      throw new Error("Could not save the link to the database.");
    }
    
    return {
      shortCode,
    };
  }
);
