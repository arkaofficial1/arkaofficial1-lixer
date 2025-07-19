"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Loader2, Link as LinkIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShortUrl('');

    if (!longUrl) {
      setError('Please enter a URL to shorten.');
      setIsLoading(false);
      return;
    }

    // Mock API call
    setTimeout(() => {
      try {
        new URL(longUrl);
        const mockShort = `https://shrnk.ry/${Math.random().toString(36).substring(2, 8)}`;
        setShortUrl(mockShort);
      } catch (_) {
        setError('Please enter a valid URL.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: "Copied to clipboard!",
      description: "The shortened link is now in your clipboard.",
    });
  };

  return (
    <div className="w-full max-w-2xl">
      <Card className="w-full shadow-lg border bg-card/80 backdrop-blur-sm rounded-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-fit">
            <LinkIcon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl lg:text-4xl font-bold">Shrink Your Links</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            A simple, modern, and fast URL shortener.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="url"
                placeholder="https://example.com/very/long/url/to/shorten"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="h-12 text-base flex-grow"
                aria-label="URL to shorten"
                disabled={isLoading}
              />
              <Button type="submit" className="h-12 text-base font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Shortening...
                  </>
                ) : (
                  'Shorten'
                )}
              </Button>
            </div>
            {error && <p className="text-destructive text-sm text-center">{error}</p>}
          </form>

          {shortUrl && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between animate-in fade-in duration-500">
              <p className="text-primary font-mono truncate mr-4" title={shortUrl}>{shortUrl}</p>
              <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy shortened link">
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
