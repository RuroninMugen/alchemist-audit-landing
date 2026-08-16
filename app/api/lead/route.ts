import { NextRequest, NextResponse } from "next/server";
import { createLead, type LeadRecord } from "@/lib/nocodb";
import { sendLeadConfirmation, sendLeadNotification } from "@/lib/resend";

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function asNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { website, industry, goal, budget, firstName, email } =
    (body ?? {}) as Record<string, unknown>;

  if (
    !asNonEmptyString(website) ||
    !asNonEmptyString(industry) ||
    !asNonEmptyString(goal) ||
    !asNonEmptyString(budget) ||
    !asNonEmptyString(firstName) ||
    !isValidEmail(email)
  ) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const lead: LeadRecord = {
    site_url: website,
    secteur: industry,
    objectif: goal,
    budget,
    prenom: firstName,
    email,
  };

  // Fire all three integrations in parallel. None of them should block the
  // prospect-facing confirmation screen: log failures server-side and move on.
  const [nocodbResult, notifyResult, confirmResult] = await Promise.allSettled([
    createLead(lead),
    sendLeadNotification(lead),
    sendLeadConfirmation(lead),
  ]);

  if (nocodbResult.status === "rejected") {
    console.error("[lead] NocoDB insert failed:", nocodbResult.reason);
  }
  if (notifyResult.status === "rejected") {
    console.error("[lead] Resend notify email failed:", notifyResult.reason);
  }
  if (confirmResult.status === "rejected") {
    console.error("[lead] Resend confirmation email failed:", confirmResult.reason);
  }

  // Always 200: infra hiccups in dev must never block the prospect's UX.
  return NextResponse.json({
    ok: true,
    nocodb: nocodbResult.status === "fulfilled",
    notify: notifyResult.status === "fulfilled",
    confirmation: confirmResult.status === "fulfilled",
  });
}
