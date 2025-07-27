import { WandSparkles } from 'lucide-react';
import { Link } from '@/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function Logo({ className }: { className?: string }) {
  const t = useTranslations('Logo');
  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <div className="bg-primary/20 group-hover:bg-primary/30 transition-colors p-2 rounded-lg">
        <WandSparkles className="h-5 w-5 text-primary" />
      </div>
      <span className="text-xl font-bold text-foreground tracking-tight">{t('brand')}</span>
    </Link>
  );
}
