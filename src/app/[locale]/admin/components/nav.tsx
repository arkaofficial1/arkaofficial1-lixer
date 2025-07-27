"use client"

import {
  Home,
  LineChart,
  Link as LinkIcon,
  Users,
  Settings,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Link, usePathname } from "@/navigation"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export function Nav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname()
  const t = useTranslations('AdminNav');
  
  const navItems = [
    { href: "/admin/dashboard", label: t('dashboard'), icon: Home },
    { href: "/admin/links", label: t('links'), icon: LinkIcon },
    { href: "/admin/users", label: t('users'), icon: Users },
    { href: "/admin/analytics", label: t('analytics'), icon: LineChart },
    { href: "/admin/settings", label: t('settings'), icon: Settings },
  ]
  
  const linkClass = isMobile 
    ? "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
    : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
    
  const activeLinkClass = isMobile ? "bg-muted text-foreground" : "bg-muted text-primary";

  return (
    <nav className={cn("grid items-start gap-1 text-sm font-medium", isMobile && "text-lg")}>
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(linkClass, isActive && activeLinkClass)}
          >
            <Icon className={isMobile ? "h-5 w-5" : "h-4 w-4"} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
