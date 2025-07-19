'use server';
/**
 * @fileOverview A flow for shortening URLs.
 *
 * - shortenUrl - A function that handles the URL shortening process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { FieldValue } from 'firebase-admin/firestore';

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
    const shortCode = Math.random().toString(36).substring(2, 8);
    
    const linkDocRef = db.collection('links').doc(shortCode);
    
    await linkDocRef.set({
      originalUrl: input.url,
      shortCode: shortCode,
      createdAt: FieldValue.serverTimestamp(),
      clicks: 0
    });

    return {
      shortCode,
    };
  }
);
