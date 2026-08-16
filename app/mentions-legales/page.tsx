import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales & confidentialité — Alchemist",
  description:
    "Mentions légales et politique de confidentialité d'Alchemist : qui édite ce site, quelles données sont collectées via le quiz d'audit et pourquoi.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-2xl px-6 py-20">
        <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
          Mentions légales & confidentialité
        </h1>

        <section id="mentions-legales" className="mt-12 scroll-mt-24">
          <h2 className="font-display text-xl text-foreground">
            Mentions légales
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
            <p>
              Ce site est édité par Rudy, exerçant sous le nom Alchemist
              Motion.
            </p>
            <p>
              Directeur de la publication : Rudy.
              <br />
              Contact :{" "}
              <a
                href="mailto:rudyvalace@gmail.com"
                className="text-accent hover:underline"
              >
                rudyvalace@gmail.com
              </a>
            </p>
          </div>
        </section>

        <section id="confidentialite" className="mt-12 scroll-mt-24">
          <h2 className="font-display text-xl text-foreground">
            Politique de confidentialité
          </h2>
          <div className="mt-4 space-y-5 text-sm leading-relaxed text-muted">
            <div>
              <h3 className="font-medium text-foreground">
                Quelles données sont collectées ?
              </h3>
              <p className="mt-1">
                Via le quiz d&rsquo;audit : l&rsquo;adresse de votre site
                web, votre secteur d&rsquo;activité, votre objectif marketing
                principal, votre budget marketing mensuel, votre prénom et
                votre adresse email.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Pourquoi ?</h3>
              <p className="mt-1">
                Uniquement pour préparer votre audit personnalisé, vous
                l&rsquo;envoyer par email, et vous recontacter à ce sujet si
                besoin.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Base légale</h3>
              <p className="mt-1">
                Votre consentement, exprimé par la soumission volontaire du
                formulaire.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">
                Qui traite ces données ?
              </h3>
              <p className="mt-1">
                Rudy (Alchemist Motion), avec deux prestataires techniques
                utilisés pour faire fonctionner le service : NocoDB pour le
                stockage de votre demande, et Resend pour l&rsquo;envoi des
                emails. Vos données ne sont ni vendues ni partagées à
                d&rsquo;autres tiers.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">
                Durée de conservation
              </h3>
              <p className="mt-1">
                Le temps de la relation commerciale. Vous pouvez demander la
                suppression de vos données à tout moment.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Vos droits</h3>
              <p className="mt-1">
                Conformément au RGPD, vous disposez d&rsquo;un droit
                d&rsquo;accès, de rectification et de suppression de vos
                données. Pour l&rsquo;exercer, écrivez à{" "}
                <a
                  href="mailto:rudyvalace@gmail.com"
                  className="text-accent hover:underline"
                >
                  rudyvalace@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <Link
          href="/"
          className="mt-16 inline-block text-sm font-medium text-accent hover:underline"
        >
          ← Retour à l&rsquo;accueil
        </Link>
      </div>
    </main>
  );
}
