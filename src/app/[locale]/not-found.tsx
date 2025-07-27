import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('NotFoundPage');
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {t('description')}
      </p>
      <Link href="/" className="mt-8 text-primary hover:underline">
        {t('link')}
      </Link>
    </div>
  );
}
