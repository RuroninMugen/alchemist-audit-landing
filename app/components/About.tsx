export default function About() {
  return (
    <section className="border-b border-border/60 bg-surface/50">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-6 py-16 text-center sm:flex-row sm:text-left">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-accent/50 font-display text-xl text-accent">
          R
        </span>
        <div>
          <p className="font-medium text-foreground">
            Un vrai humain derrière Alchemist
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Rudy — 7 ans d&rsquo;expérience en motion design & 3D, certifié
            développeur full-stack. Je conçois et supervise personnellement
            chaque audit.
          </p>
          <a
            href="mailto:rudyvalace@gmail.com"
            className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
          >
            Me contacter directement →
          </a>
        </div>
      </div>
    </section>
  );
}
