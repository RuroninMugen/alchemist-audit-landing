"use client";

import { useState, type FormEvent } from "react";

type Phase = "quiz" | "analyzing" | "success";

type Answers = {
  website: string;
  industry: string;
  goal: string;
  budget: string;
  firstName: string;
  email: string;
};

const INITIAL_ANSWERS: Answers = {
  website: "",
  industry: "",
  goal: "",
  budget: "",
  firstName: "",
  email: "",
};

const INDUSTRY_OPTIONS = [
  "E-commerce",
  "SaaS / Logiciel",
  "Services locaux",
  "Autre",
];

const GOAL_OPTIONS = [
  "Générer plus de trafic",
  "Convertir plus de visiteurs",
  "Améliorer mon positionnement Google",
  "Je ne sais pas encore",
];

const BUDGET_OPTIONS = [
  "Moins de 1 000 €",
  "1 000 € – 5 000 €",
  "5 000 € – 15 000 €",
  "Plus de 15 000 €",
];

const ANALYZING_STEPS = [
  "Analyse technique du site",
  "Benchmark concurrentiel",
  "Génération du plan d'action",
];

const TOTAL_STEPS = 5;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function OptionCard({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border px-5 py-4 text-left text-sm font-medium transition-colors ${
        selected
          ? "border-accent bg-accent/10 text-foreground"
          : "border-border bg-surface text-muted hover:border-accent/40 hover:text-foreground"
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        {label}
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            selected ? "border-accent bg-accent" : "border-border"
          }`}
        >
          {selected && (
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--background)"
              strokeWidth="3"
            >
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}

export default function AuditQuiz() {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);

  const update = (patch: Partial<Answers>) =>
    setAnswers((prev) => ({ ...prev, ...patch }));

  const canAdvance = (() => {
    switch (step) {
      case 0:
        return answers.website.trim().length > 2;
      case 1:
        return answers.industry !== "";
      case 2:
        return answers.goal !== "";
      case 3:
        return answers.budget !== "";
      default:
        return true;
    }
  })();

  const goNext = () => {
    if (!canAdvance) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const canSubmit =
    answers.firstName.trim().length > 0 && isValidEmail(answers.email);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setPhase("analyzing");

    // Keep a minimum delay so the "analyzing" animation doesn't flash by,
    // but never let a slow/failing backend block the confirmation screen.
    const minDelay = new Promise((resolve) => window.setTimeout(resolve, 1200));
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    const submission = fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        website: answers.website,
        industry: answers.industry,
        goal: answers.goal,
        budget: answers.budget,
        firstName: answers.firstName,
        email: answers.email,
      }),
      signal: controller.signal,
    })
      .catch((error) => {
        // Network/infra failure: log only, the prospect still sees success.
        console.error("Lead submission failed", error);
      })
      .finally(() => window.clearTimeout(timeout));

    Promise.all([submission, minDelay]).then(() => setPhase("success"));
  };

  const restart = () => {
    setAnswers(INITIAL_ANSWERS);
    setStep(0);
    setPhase("quiz");
  };

  return (
    <section id="quiz" className="border-b border-border/60">
      <div className="mx-auto w-full max-w-2xl px-6 py-20">
        {phase === "quiz" && (
          <>
            <div className="mb-10 text-center">
              <h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
                Votre audit commence ici
              </h2>
              <p className="mt-3 text-muted">
                Cinq questions rapides, puis nous nous occupons du reste.
              </p>
            </div>

            <div className="mb-8 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-300"
                  style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                />
              </div>
              <span className="shrink-0 text-xs tabular-nums text-muted">
                {step + 1} / {TOTAL_STEPS}
              </span>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-surface p-7 sm:p-9"
            >
              {step === 0 && (
                <fieldset>
                  <legend className="text-lg font-medium text-foreground">
                    Quel est votre site web ?
                  </legend>
                  <p className="mt-1 text-sm text-muted">
                    On l&rsquo;utilise pour lancer l&rsquo;analyse technique.
                  </p>
                  <input
                    type="text"
                    inputMode="url"
                    placeholder="www.votre-site.com"
                    value={answers.website}
                    onChange={(e) => update({ website: e.target.value })}
                    className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-background"
                  />
                </fieldset>
              )}

              {step === 1 && (
                <fieldset>
                  <legend className="text-lg font-medium text-foreground">
                    Quel est votre secteur d&rsquo;activité ?
                  </legend>
                  <div className="mt-5 grid gap-3">
                    {INDUSTRY_OPTIONS.map((option) => (
                      <OptionCard
                        key={option}
                        label={option}
                        selected={answers.industry === option}
                        onSelect={() => update({ industry: option })}
                      />
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <fieldset>
                  <legend className="text-lg font-medium text-foreground">
                    Quel est votre objectif principal ?
                  </legend>
                  <div className="mt-5 grid gap-3">
                    {GOAL_OPTIONS.map((option) => (
                      <OptionCard
                        key={option}
                        label={option}
                        selected={answers.goal === option}
                        onSelect={() => update({ goal: option })}
                      />
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 3 && (
                <fieldset>
                  <legend className="text-lg font-medium text-foreground">
                    Quel est votre budget marketing mensuel ?
                  </legend>
                  <div className="mt-5 grid gap-3">
                    {BUDGET_OPTIONS.map((option) => (
                      <OptionCard
                        key={option}
                        label={option}
                        selected={answers.budget === option}
                        onSelect={() => update({ budget: option })}
                      />
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 4 && (
                <fieldset>
                  <legend className="text-lg font-medium text-foreground">
                    Où envoyer votre audit ?
                  </legend>
                  <p className="mt-1 text-sm text-muted">
                    Vous recevrez votre plan d&rsquo;action personnalisé par email sous 24h.
                  </p>
                  <div className="mt-5 grid gap-4">
                    <input
                      type="text"
                      placeholder="Prénom"
                      autoFocus
                      value={answers.firstName}
                      onChange={(e) => update({ firstName: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-background"
                    />
                    <input
                      type="email"
                      placeholder="Email professionnel"
                      value={answers.email}
                      onChange={(e) => update({ email: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-background"
                    />
                  </div>
                </fieldset>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {step < TOTAL_STEPS - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canAdvance}
                    className="order-1 w-full whitespace-nowrap rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40 sm:order-2 sm:w-auto"
                  >
                    Continuer →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="order-1 w-full whitespace-nowrap rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40 sm:order-2 sm:w-auto"
                  >
                    Recevoir mon audit gratuit
                  </button>
                )}

                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0}
                  className="order-2 text-center text-sm font-medium text-muted transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-0 sm:order-1 sm:text-left"
                >
                  ← Retour
                </button>
              </div>
            </form>
          </>
        )}

        {phase === "analyzing" && (
          <div className="flex flex-col items-center rounded-2xl border border-border bg-surface px-8 py-16 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
            <h3 className="mt-6 font-display text-2xl text-foreground">
              Préparation de votre audit
            </h3>
            <ul className="mt-6 space-y-2 text-sm text-muted">
              {ANALYZING_STEPS.map((label) => (
                <li key={label}>{label}…</li>
              ))}
            </ul>
          </div>
        )}

        {phase === "success" && (
          <div className="flex flex-col items-center rounded-2xl border border-border bg-surface px-8 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/50 text-accent">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="mt-6 font-display text-2xl text-foreground">
              Audit en cours d&rsquo;envoi
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Merci {answers.firstName || ""} ! Votre audit personnalisé pour{" "}
              {answers.website || "votre site"} arrive à {answers.email} sous
              24h.
            </p>
            <button
              type="button"
              onClick={restart}
              className="mt-8 text-sm font-medium text-accent hover:underline"
            >
              Refaire le quiz
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
