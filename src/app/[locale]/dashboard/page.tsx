"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Edit, Trash2, BarChart2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// Moved Firestore logic into a server-side function (Server Action)
// This function will only run on the server.
async function getLinks(): Promise<Link[]> {
  'use server';
  const { db } = await import('@/lib/firebase-admin');
  const { format } = await import('date-fns');

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
             formattedDate = format(new Date(createdAt), 'yyyy-MM-dd');
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


interface Link {
    id: string;
    originalUrl: string;
    shortCode: string;
    clicks: number;
    createdAt: string; // We'll format the timestamp to a string
}

export default function DashboardPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [baseUrl, setBaseUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Fetch links on component mount by calling the server action
    getLinks().then(setLinks);
    // Set base URL on the client side
    if (typeof window !== 'undefined') {
        setBaseUrl(window.location.host);
    }
  }, []);

  const handleCopy = (shortCode: string) => {
    const fullUrl = `https://${baseUrl}/l/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    toast({
        title: "Copied!",
        description: "The shortened link has been copied to your clipboard.",
    });
  }

  return (
    <div className="container mx-auto py-10 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">My Links Dashboard</CardTitle>
          <CardDescription>Manage your shortened links and track their performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%] hidden md:table-cell">Original URL</TableHead>
                <TableHead>Short Link</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead className="hidden sm:table-cell">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No links created yet.
                  </TableCell>
                </TableRow>
              ) : (
                links.map((link) => {
                  const shortUrl = `${baseUrl}/l/${link.shortCode}`;
                  return (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium truncate max-w-xs hidden md:table-cell">
                        <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {link.originalUrl}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <a href={`//${shortUrl}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {shortUrl}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                            <BarChart2 className="h-3 w-3" />
                            {link.clicks.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{link.createdAt}</TableCell>
                      <TableCell className="text-right space-x-0">
                        {/* Functionality for these buttons can be added later */}
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Copy Link" onClick={() => handleCopy(link.shortCode)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit Link">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" aria-label="Delete Link">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
