import { Link } from '@/navigation';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="mt-8 text-primary hover:underline">
        Go back to the homepage
      </Link>
    </div>
  );
}
