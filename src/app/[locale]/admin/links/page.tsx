
"use client";

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
import { deleteLink, getAllLinks, type LinkWithId } from "./actions"
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

function LinkActions({ linkId, t }: { linkId: string, t: any }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteLink(linkId);
            if (result.success) {
                toast({
                    title: "Success",
                    description: "Link has been deleted.",
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error || "Failed to delete link.",
                });
            }
        });
    }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">{t('toggleMenu')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
        <DropdownMenuItem>{t('edit')}</DropdownMenuItem>
        <DropdownMenuItem>{t('disable')}</DropdownMenuItem>
        <DropdownMenuItem
            className="text-destructive"
            onClick={handleDelete}
            disabled={isPending}
        >
            {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function LinkRow({ link, t }: { link: LinkWithId, t: any }) {
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
        <Badge variant="outline">{t('statusActive')}</Badge>
      </TableCell>
      <TableCell>
        <LinkActions linkId={link.id} t={t} />
      </TableCell>
    </TableRow>
  )
}


export default function AdminLinksPage() {
  const [links, setLinks] = useState<LinkWithId[]>([]);
  const t = useTranslations('AdminLinksPage');
  const tActions = useTranslations('AdminTableActions');

  useEffect(() => {
    getAllLinks().then(setLinks);
  }, [links]); // Re-fetch when links state changes after deletion

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('colOriginalUrl')}</TableHead>
                <TableHead>{t('colShortLink')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('colCreated')}</TableHead>
                <TableHead className="hidden md:table-cell text-center">{t('colClicks')}</TableHead>
                <TableHead>{t('colStatus')}</TableHead>
                <TableHead>
                  <span className="sr-only">{tActions('actions')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <LinkRow key={link.id} link={link} t={tActions} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
