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
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { format } from 'date-fns';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
    initializeApp({
      credential: cert(JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY))
    });
  } else {
    // For local development, it will use application default credentials.
    initializeApp();
  }
}

const db = getFirestore();

interface Link {
    id: string;
    originalUrl: string;
    shortCode: string;
    clicks: number;
    createdAt: string; // We'll format the timestamp to a string
}

async function getLinks(): Promise<Link[]> {
  try {
    const linksCollection = db.collection('links');
    const snapshot = await linksCollection.orderBy('createdAt', 'desc').get();
    
    if (snapshot.empty) {
      console.log('No matching documents.');
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
          // Fallback for string or number dates if any
           formattedDate = format(new Date(createdAt), 'yyyy-MM-dd');
        }

        return {
            id: doc.id,
            originalUrl: data.originalUrl,
            shortCode: data.shortCode,
            clicks: data.clicks || 0,
            createdAt: formattedDate,
        };
    });

    return links;
  } catch (error) {
    console.error("Error getting documents:", error);
    return [];
  }
}


export default async function DashboardPage() {
  const links = await getLinks();
  // Ensure NEXT_PUBLIC_BASE_URL is set in your environment variables
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'localhost:9002';

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
              {links.map((link) => {
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
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Copy Link">
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
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
