"use client";

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, Link } from '@/navigation';


export function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();

  const navLinks = (
    <>
      <Button variant="ghost" asChild>
        <Link href="/dashboard">{t('dashboard')}</Link>
      </Button>
       <Button variant="ghost" asChild>
        <Link href="/admin/dashboard">Admin</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/help">{t('help')}</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/login">{t('login')}</Link>
      </Button>
      <Button variant="default" asChild className="font-semibold bg-primary/90 hover:bg-primary text-primary-foreground">
        <Link href="/signup">{t('signup')}</Link>
      </Button>
    </>
  );

  const LanguageSwitcher = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
           <Link href={pathname} locale="en">English</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={pathname} locale="fa">فارسی</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="py-4 px-4 sm:px-6 md:px-10 bg-transparent w-full absolute top-0 left-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <nav className="hidden md:flex items-center gap-1">
          {navLinks}
          <LanguageSwitcher />
        </nav>
        <div className="md:hidden flex items-center">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t('openMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 p-4">
                <div className="pb-4 border-b">
                   <Logo />
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start text-base" asChild>
                    <Link href="/dashboard">{t('dashboard')}</Link>
                  </Button>
                   <Button variant="ghost" className="justify-start text-base" asChild>
                    <Link href="/admin/dashboard">Admin</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start text-base" asChild>
                    <Link href="/help">{t('help')}</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start text-base" asChild>
                    <Link href="/login">{t('login')}</Link>
                  </Button>
                  <Button variant="default" className="text-base" asChild>
                    <Link href="/signup">{t('signup')}</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
