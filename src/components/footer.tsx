import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-6 px-6 md:px-10 bg-transparent w-full">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-4 mb-2">
          <Link href="/help" className="hover:text-primary transition-colors">FAQ</Link>
          <Link href="/help#contact" className="hover:text-primary transition-colors">Contact</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} ShrinkRay. All rights reserved.</p>
      </div>
    </footer>
  );
}
