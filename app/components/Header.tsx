export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-accent/50 text-accent">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M12 2 L12 8" strokeLinecap="round" />
              <path d="M8 8 H16 L19.5 19 A2 2 0 0 1 17.6 22 H6.4 A2 2 0 0 1 4.5 19 Z" />
              <path d="M6.2 15 H17.8" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-display text-lg tracking-tight text-foreground">
            Alchemist
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-muted sm:flex">
          <a href="#how" className="transition-colors hover:text-foreground">
            Comment ça marche
          </a>
          <a href="#get" className="transition-colors hover:text-foreground">
            Ce que vous recevez
          </a>
        </nav>

        <a
          href="#quiz"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent/90"
        >
          Démarrer mon audit
        </a>
      </div>
    </header>
  );
}
