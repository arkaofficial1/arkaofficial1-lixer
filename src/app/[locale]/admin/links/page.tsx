import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAllLinks, type LinkWithId } from "./actions"

function LinkActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Disable</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function LinkRow({ link }: { link: LinkWithId }) {
  const shortUrl = `linxer.com/l/${link.shortCode}`; // In a real app, this domain should be dynamic
  return (
    <TableRow>
      <TableCell className="font-medium truncate max-w-sm">
        <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {link.originalUrl}
        </a>
      </TableCell>
      <TableCell>
        <a href={`http://${shortUrl}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          {shortUrl}
        </a>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {link.createdAt}
      </TableCell>
       <TableCell className="hidden md:table-cell text-center">
        {link.clicks}
      </TableCell>
      <TableCell>
        <Badge variant="outline">Active</Badge>
      </TableCell>
      <TableCell>
        <LinkActions />
      </TableCell>
    </TableRow>
  )
}


export default async function AdminLinksPage() {
  const links = await getAllLinks();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>All Links</CardTitle>
          <CardDescription>
            Manage all links created on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Original URL</TableHead>
                <TableHead>Short Link</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="hidden md:table-cell text-center">Clicks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <LinkRow key={link.id} link={link} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
