"use client";

import { NumberTicker } from "@/components/ui/number-ticker";

const stats = [
  { value: 7, suffix: " ans", label: "d'expertise motion & 3D" },
  { value: 5, suffix: " min", label: "pour compléter le quiz" },
  { value: 24, suffix: "h", label: "avant de recevoir vos résultats" },
  { value: 3, suffix: "", label: "leviers d'action priorisés" },
];

export default function TrustBar() {
  return (
    <section className="border-b border-border/60 bg-surface/50">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-8 px-6 py-20 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-display text-2xl text-accent sm:text-3xl">
              <NumberTicker value={stat.value} className="text-accent" />
              {stat.suffix}
            </div>
            <div className="mt-1 text-sm text-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
