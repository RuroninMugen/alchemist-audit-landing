"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Répondez à 5 questions",
    description:
      "Votre site, votre secteur, votre objectif et votre budget. Deux minutes suffisent.",
  },
  {
    number: "02",
    title: "Nous analysons votre présence",
    description:
      "Analyse automatisée (SEO technique, contenu, positionnement, concurrence), recoupée par notre équipe pour garantir sa pertinence.",
  },
  {
    number: "03",
    title: "Recevez votre plan d'action",
    description:
      "Votre audit et ses 3 leviers prioritaires, envoyés par email sous 24h.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-b border-border/60">
      <div className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Comment ça marche
          </h2>
          <p className="mt-3 text-muted">
            De la question à la clarté, en trois étapes simples.
          </p>
        </div>

        <div className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-6 hidden h-px origin-left bg-gradient-to-r from-accent/0 via-accent/25 to-accent/0 sm:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />

          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <motion.div
                className="font-display text-4xl text-accent/70"
                animate={{ scale: [1, 1.08, 1], opacity: [0.65, 1, 0.65] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.35,
                }}
              >
                {step.number}
              </motion.div>
              <h3 className="mt-3 text-lg font-medium text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
