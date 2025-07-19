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

const mockLinks = [
  {
    id: '1',
    originalUrl: 'https://www.verylongurl-example.com/some/path/to/a/resource',
    shortUrl: 'https://shrnk.ry/abc123',
    clicks: 1254,
    createdAt: '2023-10-26',
  },
  {
    id: '2',
    originalUrl: 'https://another-example-of-a-long-url.com/products/item-456',
    shortUrl: 'https://shrnk.ry/def456',
    clicks: 832,
    createdAt: '2023-10-25',
  },
  {
    id: '3',
    originalUrl: 'https://github.com/facebook/react/issues/new',
    shortUrl: 'https://shrnk.ry/ghi789',
    clicks: 234,
    createdAt: '2023-10-24',
  },
  {
    id: '4',
    originalUrl: 'https://medium.com/a-very-long-article-title-that-needs-shortening',
    shortUrl: 'https://shrnk.ry/jkl012',
    clicks: 56,
    createdAt: '2023-10-23',
  },
];

export default function DashboardPage() {
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
              {mockLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium truncate max-w-xs hidden md:table-cell">
                    <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {link.originalUrl}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <a href={`//${link.shortUrl.split('//')[1]}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {link.shortUrl}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
