
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
import { usePathname, Link, useRouter } from '@/navigation';
import React from 'react';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/');
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out.",
      });
    }
  };

  const navLinks = [
      { href: "/dashboard", label: t('nav.dashboard'), protected: true },
      { href: "/admin/dashboard", label: t('nav.admin'), protected: true, admin: true }, // Assuming admin is a role
      { href: "/help", label: t('nav.help'), protected: false },
  ];

  const filteredNavLinks = navLinks.filter(link => {
      if (link.protected && !user) return false;
      // Add admin role check here in the future
      // if (link.admin && user.role !== 'admin') return false; 
      return true;
  });

  const authLinks = (
    <div className='flex items-center gap-1'>
        <Button variant="ghost" asChild>
            <Link href="/login">{t('auth.login')}</Link>
        </Button>
        <Button variant="default" asChild className="font-semibold bg-primary/90 hover:bg-primary text-primary-foreground">
            <Link href="/signup">{t('auth.signup')}</Link>
        </Button>
    </div>
  );
  
  const userLinks = (
     <div className='flex items-center gap-1'>
        <Button variant="ghost" onClick={handleLogout}>
            {t('auth.logout')}
        </Button>
    </div>
  )

  const LanguageSwitcher = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t('language.change')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
           <Link href={pathname} locale="en">{t('language.en')}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={pathname} locale="fa">{t('language.fa')}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="py-4 px-4 sm:px-6 md:px-10 bg-transparent w-full absolute top-0 left-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
            <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {filteredNavLinks.map(link => (
            <Button variant="ghost" asChild key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          {!loading && (user ? userLinks : authLinks)}
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
                   <Link href="/">
                    <span className="text-xl font-bold tracking-tight">{t('Logo.brand')}</span>
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                 {filteredNavLinks.map(link => (
                    <Button variant="ghost" className="justify-start text-base" asChild key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  ))}
                  <div className="border-t pt-4 mt-2 flex flex-col gap-2">
                     {!loading && (user ? (
                         <Button variant="ghost" className="justify-start text-base" onClick={handleLogout}>
                            {t('auth.logout')}
                         </Button>
                     ) : (
                        <>
                         <Button variant="ghost" className="justify-start text-base" asChild>
                            <Link href="/login">{t('auth.login')}</Link>
                         </Button>
                         <Button variant="default" className="text-base" asChild>
                            <Link href="/signup">{t('auth.signup')}</Link>
                         </Button>
                        </>
                     ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
