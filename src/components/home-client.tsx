"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Loader2, WandSparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { shortenUrl } from '@/ai/flows/shorten-url-flow';
import { z } from 'zod';

interface HomeClientProps {
  translations: {
    title: string;
    description: string;
    placeholder: string;
    button: string;
    buttonLoading: string;
    error: string;
    errorInvalid: string;
    copySuccessTitle: string;
    copySuccessDescription: string;
    copyButton: string;
  };
}

export function HomeClient({ translations }: HomeClientProps) {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  
  const UrlSchema = z.string().url({ message: translations.errorInvalid });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShortUrl('');

    if (!longUrl) {
      setError(translations.error);
      setIsLoading(false);
      return;
    }
    
    const validation = UrlSchema.safeParse(longUrl);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const result = await shortenUrl({ url: longUrl });
      // Add the /l/ prefix for the redirect route
      const fullShortUrl = `${window.location.host}/l/${result.shortCode}`;
      setShortUrl(fullShortUrl);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: translations.copySuccessTitle,
      description: translations.copySuccessDescription,
    });
  };

  return (
    <div className="w-full max-w-2xl px-4">
      <Card className="w-full shadow-2xl shadow-primary/10 border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl">
        <CardHeader className="text-center items-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-xl mb-4 w-fit border border-primary/20">
            <WandSparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl lg:text-4xl font-bold">{translations.title}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            {translations.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="url"
                placeholder={translations.placeholder}
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="h-12 text-base flex-grow bg-background/80"
                aria-label="URL to shorten"
                disabled={isLoading}
              />
              <Button type="submit" className="h-12 text-base font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {translations.buttonLoading}
                  </>
                ) : (
                  translations.button
                )}
              </Button>
            </div>
            {error && <p className="text-destructive text-sm text-center pt-2">{error}</p>}
          </form>

          {shortUrl && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between animate-in fade-in duration-500">
              <p className="text-primary font-mono truncate mr-4" title={shortUrl}>{shortUrl}</p>
              <Button variant="ghost" size="icon" onClick={handleCopy} aria-label={translations.copyButton}>
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
