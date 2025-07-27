'use server';
/**
 * @fileOverview A flow for shortening URLs and saving them to Firestore.
 *
 * - shortenUrl - A function that handles the URL shortening process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { db } from '@/lib/firebase-admin'; // Use the centralized admin instance
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


const namingPrompt = ai.definePrompt({
    name: 'namingPrompt',
    input: { schema: z.object({ url: z.string() }) },
    output: { schema: z.object({ shortCode: z.string() }) },
    prompt: `You are an expert in creating short, memorable, and SEO-friendly URL slugs.
    
    Analyze the content of the following URL and generate a two-word, lowercase, hyphen-separated slug for it.
    
    For example:
    - If the URL is about a recipe for chocolate cake, the slug should be "chocolate-cake".
    - If the URL is an article about technology trends, the slug could be "tech-trends".
    
    Do not use more than two words.
    
    URL: {{{url}}}`,
});


const shortenUrlFlow = ai.defineFlow(
  {
    name: 'shortenUrlFlow',
    inputSchema: ShortenUrlInputSchema,
    outputSchema: ShortenUrlOutputSchema,
  },
  async (input) => {
    // Generate a smart short code using AI
    const { output } = await namingPrompt({ url: input.url });
    const shortCode = output!.shortCode;
    
    // Save to Firestore
    try {
      const linkDocRef = db.collection('links').doc(shortCode);
      const doc = await linkDocRef.get();

      // To keep it simple, if the slug already exists, we'll just append a random suffix.
      // A more robust solution would be to retry the AI prompt or have a more complex collision resolution.
      if (doc.exists) {
        const newShortCode = `${shortCode}-${Math.random().toString(36).substring(2, 5)}`;
         await db.collection('links').doc(newShortCode).set({
            originalUrl: input.url,
            shortCode: newShortCode,
            clicks: 0,
            createdAt: FieldValue.serverTimestamp(),
        });
        return { shortCode: newShortCode };
      }

      await linkDocRef.set({
        originalUrl: input.url,
        shortCode: shortCode,
        clicks: 0,
        createdAt: FieldValue.serverTimestamp(),
        // In the future, we can add a userId here
      });

       return {
            shortCode,
       };
    } catch (error) {
      console.error("Error saving link to Firestore in flow:", error);
      // In a real app, you'd want more robust error handling.
      throw new Error("Could not save the link to the database.");
    }
  }
);
