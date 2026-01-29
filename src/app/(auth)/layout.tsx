import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background-secondary flex min-h-screen flex-col">
      <header className="border-border border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-primary font-serif text-xl font-bold">LawMadeSimple</span>
          </Link>
        </div>
      </header>

      <main id="main-content" className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="border-border border-t bg-white py-4">
        <div className="text-foreground-muted mx-auto max-w-7xl px-4 text-center text-sm sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} LawMadeSimple. Democratizing Nigerian law.</p>
        </div>
      </footer>
    </div>
  );
}
