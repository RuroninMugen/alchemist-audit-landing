import "server-only";
import type { LeadRecord } from "./nocodb";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

async function sendEmail(payload: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `Alchemist <${from}>`,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend send failed (${res.status}): ${body}`);
  }
}

/** Internal notification email — sent to RESEND_NOTIFY_EMAIL with the lead recap. */
export async function sendLeadNotification(lead: LeadRecord): Promise<void> {
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL;
  if (!notifyEmail) {
    throw new Error("RESEND_NOTIFY_EMAIL is not configured.");
  }

  const rows: [string, string][] = [
    ["Site web", lead.site_url],
    ["Secteur", lead.secteur],
    ["Objectif", lead.objectif],
    ["Budget", lead.budget],
    ["Prénom", lead.prenom],
    ["Email", lead.email],
  ];

  const html = `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="margin: 0 0 4px;">Nouveau lead — Audit Alchemist</h2>
      <p style="color: #555; margin: 0 0 20px;">Un prospect vient de compléter le quiz d'audit.</p>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #888; width: 120px;">${label}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600;">${escapeHtml(
              value
            )}</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>
  `;

  await sendEmail({
    to: notifyEmail,
    subject: `Nouveau lead — ${lead.prenom} (${lead.site_url})`,
    html,
  });
}

/** Confirmation email sent to the prospect, alchemist/gold themed. */
export async function sendLeadConfirmation(lead: LeadRecord): Promise<void> {
  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; background:#0b0a08; padding: 40px 24px;">
      <div style="max-width: 480px; margin: 0 auto; background:#14120d; border:1px solid #2a2519; border-radius: 16px; padding: 40px 32px; text-align: center;">
        <div style="display:inline-flex; align-items:center; justify-content:center; width:44px; height:44px; border-radius:999px; border:1px solid #e3b25c80; color:#e3b25c; font-size:20px; margin-bottom: 20px;">
          ⚗
        </div>
        <h1 style="color:#f4efe4; font-size: 24px; font-weight: 500; margin: 0 0 12px;">
          Votre audit est en préparation, ${escapeHtml(lead.prenom)}
        </h1>
        <p style="color:#a89c86; font-family: -apple-system, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          Nous analysons <strong style="color:#f4efe4;">${escapeHtml(
            lead.site_url
          )}</strong> pour révéler ce qui freine votre trafic, vos conversions et votre positionnement Google.
        </p>
        <p style="color:#a89c86; font-family: -apple-system, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
          Votre plan d'action personnalisé arrive dans cette boîte mail sous <strong style="color:#e3b25c;">24h</strong>.
        </p>
        <div style="height:1px; background:#2a2519; margin: 0 0 24px;"></div>
        <p style="color:#6b6152; font-family: -apple-system, Helvetica, Arial, sans-serif; font-size: 12px; margin: 0;">
          Alchemist — Transformez votre marketing en clarté.
        </p>
      </div>
    </div>
  `;

  await sendEmail({
    to: lead.email,
    subject: "Votre audit Alchemist arrive bientôt ⚗",
    html,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
