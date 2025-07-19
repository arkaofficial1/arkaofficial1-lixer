'use server';
/**
 * @fileOverview A flow for shortening URLs and saving them to Firestore.
 *
 * - shortenUrl - A function that handles the URL shortening process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

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
