#!/usr/bin/env node
/**
 * One-off provisioning script: creates the "leads" table in NocoDB if it
 * doesn't already exist, and prints the NOCODB_TABLE_ID to put in .env.local.
 *
 * Usage:
 *   NOCODB_API_URL=http://localhost:8080 NOCODB_API_TOKEN=xxx node scripts/setup-nocodb.mjs
 * (or just `node scripts/setup-nocodb.mjs` once .env.local has API_URL/TOKEN —
 * this script loads .env.local itself, no extra deps required)
 */
import { readFileSync } from "node:fs";

function loadEnvLocal() {
  try {
    const content = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim();
      }
    }
  } catch {
    // no .env.local, rely on process env
  }
}

loadEnvLocal();

const BASE_URL = process.env.NOCODB_API_URL;
const TOKEN = process.env.NOCODB_API_TOKEN;
const BASE_TITLE_HINT = process.env.NOCODB_BASE_TITLE; // optional override

if (!BASE_URL || !TOKEN) {
  console.error("Missing NOCODB_API_URL or NOCODB_API_TOKEN (check .env.local).");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "xc-token": TOKEN,
};

async function api(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  if (!res.ok) {
    throw new Error(`${options.method ?? "GET"} ${path} -> ${res.status}: ${text}`);
  }
  return json;
}

async function main() {
  console.log(`→ Listing bases on ${BASE_URL} ...`);
  const basesRes = await api("/api/v2/meta/bases");
  const bases = basesRes.list ?? basesRes.bases ?? basesRes;
  if (!Array.isArray(bases) || bases.length === 0) {
    throw new Error("No bases found on this NocoDB instance.");
  }

  const base =
    (BASE_TITLE_HINT && bases.find((b) => b.title === BASE_TITLE_HINT)) ?? bases[0];
  console.log(`→ Using base "${base.title}" (${base.id})`);

  console.log("→ Checking for existing 'leads' table ...");
  const tablesRes = await api(`/api/v2/meta/bases/${base.id}/tables`);
  const tables = tablesRes.list ?? tablesRes;
  const existing = tables.find(
    (t) => t.table_name === "audit_leads" || t.title === "leads"
  );

  if (existing) {
    console.log(`✔ Table "leads" already exists (id: ${existing.id}). Nothing to do.`);
    console.log(`\nNOCODB_TABLE_ID=${existing.id}`);
    return;
  }

  // table_name "leads" collides with an orphaned raw SQL table left over from
  // an earlier attempt (nc_yhs4___leads exists at the SQLite level with no
  // matching meta record). Use a distinct internal name and keep the
  // user-facing title as "leads".
  console.log("→ Creating 'leads' table ...");
  const table = await api(`/api/v2/meta/bases/${base.id}/tables`, {
    method: "POST",
    body: JSON.stringify({
      table_name: "audit_leads",
      title: "leads",
      columns: [
        { column_name: "site_url", title: "site_url", uidt: "SingleLineText" },
        { column_name: "secteur", title: "secteur", uidt: "SingleLineText" },
        { column_name: "objectif", title: "objectif", uidt: "SingleLineText" },
        { column_name: "budget", title: "budget", uidt: "SingleLineText" },
        { column_name: "prenom", title: "prenom", uidt: "SingleLineText" },
        { column_name: "email", title: "email", uidt: "Email" },
        {
          column_name: "statut",
          title: "statut",
          uidt: "SingleSelect",
          colOptions: {
            options: [
              { title: "nouveau" },
              { title: "contacté" },
              { title: "qualifié" },
              { title: "converti" },
              { title: "perdu" },
            ],
          },
          cdf: "nouveau",
        },
        { column_name: "created_at", title: "created_at", uidt: "CreatedTime" },
      ],
    }),
  });

  console.log(`✔ Table "leads" created (id: ${table.id}).`);
  console.log(`\nAdd this to .env.local:\nNOCODB_TABLE_ID=${table.id}`);
}

main().catch((err) => {
  console.error("✘ Setup failed:", err.message);
  process.exit(1);
});
