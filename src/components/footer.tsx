import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';

export function Footer() {
  const t = useTranslations('Footer');
  
  return (
    <footer className="py-6 px-6 md:px-10 bg-transparent w-full">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-4 mb-2">
          <Link href="/help" className="hover:text-primary transition-colors">{t('faq')}</Link>
          <Link href="/help#contact" className="hover:text-primary transition-colors">{t('contact')}</Link>
          <Link href="#" className="hover:text-primary transition-colors">{t('terms')}</Link>
          <Link href="#" className="hover:text-primary transition-colors">{t('privacy')}</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} {t('copyright')}</p>
      </div>
    </footer>
  );
}
