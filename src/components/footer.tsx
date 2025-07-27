import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export function Footer() {
  const t = useTranslations('Footer');
  
  const links = [
    { href: "/help", label: t('links.faq')},
    { href: "/help#contact", label: t('links.contact')},
    { href: "#", label: t('links.terms')},
    { href: "#", label: t('links.privacy')},
  ]

  return (
    <footer className="py-6 px-6 md:px-10 bg-transparent w-full">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-4 mb-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">{link.label}</Link>
          ))}
        </div>
        <p>{t('copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
