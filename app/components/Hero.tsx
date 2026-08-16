"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const AuditGlobe = dynamic(() => import("@/components/AuditGlobe"), {
  ssr: false,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border/60"
    >
      <div className="absolute inset-0 -z-10 opacity-55 pointer-events-none">
        <AuditGlobe />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px]"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, var(--accent-soft) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pb-20 pt-20 text-center sm:pt-28">
        <motion.span
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium tracking-wide text-muted"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Audit gratuit · résultat en 5 minutes
        </motion.span>

        <motion.h1
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="font-display text-4xl leading-[1.1] tracking-tight text-foreground sm:text-6xl"
        >
          Transformez votre marketing
          <br />
          en <em className="text-accent italic">clarté.</em>
        </motion.h1>

        <motion.p
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted"
        >
          Répondez à 5 questions sur votre site et vos objectifs. Alchemist
          révèle ce qui freine votre trafic, vos conversions et votre
          positionnement Google — et vous donne un plan d&rsquo;action priorisé.
        </motion.p>

        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-9"
        >
          <a
            href="#quiz"
            className="group relative isolate inline-flex items-center overflow-hidden rounded-full bg-accent px-7 py-3.5 text-base font-medium text-background transition-colors hover:bg-accent/90"
          >
            <span className="relative z-10">Démarrer mon audit →</span>
            <motion.span
              aria-hidden
              className="absolute inset-y-0 left-0 z-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-120%", "220%"] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: "easeInOut",
              }}
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
