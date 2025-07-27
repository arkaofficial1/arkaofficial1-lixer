
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
import { useToast } from "@/hooks/use-toast";
import type { Link } from "./actions";
import { getLinks } from "./actions";
import ProtectedRoute from "@/components/protected-route"
import { useTranslations } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton";

function DashboardPageContent() {
  const t = useTranslations('DashboardPage');
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    getLinks().then(data => {
        setLinks(data);
        setLoading(false);
    });
    if (typeof window !== 'undefined') {
        setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  const handleCopy = (shortCode: string) => {
    const fullUrl = `${baseUrl}/l/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    toast({
        title: t('toast.title'),
        description: t('toast.description'),
    });
  }

  return (
    <div className="container mx-auto py-10 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%] hidden md:table-cell">{t('table.originalUrl')}</TableHead>
                <TableHead>{t('table.shortLink')}</TableHead>
                <TableHead>{t('table.clicks')}</TableHead>
                <TableHead className="hidden sm:table-cell">{t('table.created')}</TableHead>
                <TableHead className="text-right">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : links.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    {t('noLinks')}
                  </TableCell>
                </TableRow>
              ) : (
                links.map((link) => {
                  const shortUrlDisplay = `${baseUrl.replace(/^(https?:\/\/)/, '')}/l/${link.shortCode}`;
                  const fullShortUrl = `${baseUrl}/l/${link.shortCode}`;
                  return (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium truncate max-w-xs hidden md:table-cell">
                        <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {link.originalUrl}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <a href={fullShortUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {shortUrlDisplay}
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
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t('actions.copy')} onClick={() => handleCopy(link.shortCode)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t('actions.edit')}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" aria-label={t('actions.delete')}>
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

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardPageContent />
        </ProtectedRoute>
    )
}
