'use server';
/**
 * @fileOverview A flow for shortening URLs.
 *
 * - shortenUrl - A function that handles the URL shortening process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

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
    // For now, we are not saving to the database. We will re-add this later.
    const shortCode = Math.random().toString(36).substring(2, 8);
    
    return {
      shortCode,
    };
  }
);
