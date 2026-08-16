export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} Alchemist. Tous droits réservés.</span>
        <div className="flex items-center gap-6">
          <a
            href="/mentions-legales#confidentialite"
            className="transition-colors hover:text-foreground"
          >
            Confidentialité
          </a>
          <a
            href="mailto:rudyvalace@gmail.com"
            className="transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
