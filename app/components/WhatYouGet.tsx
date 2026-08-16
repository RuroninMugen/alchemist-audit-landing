"use client";

import { motion } from "framer-motion";

const items = [
  {
    title: "Score de santé SEO",
    description:
      "Indexation, vitesse, structure technique — noté sur 100 et comparé à votre secteur.",
  },
  {
    title: "Analyse des écarts de contenu",
    description:
      "Les mots-clés et sujets où vos concurrents captent le trafic que vous devriez recevoir.",
  },
  {
    title: "Benchmark concurrentiel",
    description:
      "Où vous vous situez face à 3 concurrents directs sur votre marché.",
  },
  {
    title: "Plan d'action priorisé",
    description:
      "Les 3 actions à plus fort impact, classées par effort et par retour attendu.",
  },
];

export default function WhatYouGet() {
  return (
    <section id="get" className="border-b border-border/60 bg-surface/50">
      <div className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Ce que contient votre audit
          </h2>
          <p className="mt-3 text-muted">
            Pas un rapport générique de 40 pages — quatre réponses concrètes.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <motion.div
              key={item.title}
              className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-accent/40 text-accent">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-base font-medium text-foreground">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
