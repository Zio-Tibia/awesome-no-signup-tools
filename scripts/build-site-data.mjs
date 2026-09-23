#!/usr/bin/env node
// Regenerates the site's tool data from README.md, the single source of truth.
//
//   assets/tools.js  -> SECTORS array rendered by assets/site.js
//   index.html       -> JSON-LD ItemList and the "N free tools" counts in meta tags
//
// Run: node scripts/build-site-data.mjs          (writes files)
//      node scripts/build-site-data.mjs --check  (exits 1 if files are stale)

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const README = join(ROOT, "README.md");
const TOOLS_JS = join(ROOT, "assets", "tools.js");
const INDEX = join(ROOT, "index.html");
const SITE_URL = "https://zio-tibia.github.io/awesome-no-signup-tools/";

const ENTRY = /^- \[([^\]]+)\]\((https?:\/\/[^)\s]+)\) - (.+)$/;
// "LOCAL" badge on the site: the README description says processing stays in the browser.
const CLIENT_SIDE = /client-side|locally in the browser/i;

function slugify(label) {
  return label.toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// The whole site is about no-signup tools, so a bare "no signup" clause is noise there.
// Clauses that qualify it ("no signup required for a single link") are kept.
function siteDescription(text) {
  return text
    .replace(/\s*[,;—]\s*(?:with\s+)?no sign-?up(?: required)?(?=\s*(?:[,;(.]|$))/gi, "")
    .replace(/\s+with no sign-?up(?: required)?(?=\s*(?:[,;(.]|$))/gi, "")
    .replace(/^\s*[,;]\s*/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function parseReadme(markdown) {
  const lines = markdown.split(/\r?\n/);
  const contentsStart = lines.indexOf("## Contents");
  if (contentsStart === -1) throw new Error("README.md: '## Contents' heading not found");

  const labels = [];
  for (const line of lines.slice(contentsStart + 1)) {
    if (line.startsWith("## ")) break;
    const m = line.match(/^- \[([^\]]+)\]\(#[^)]+\)$/);
    if (m) labels.push(m[1]);
  }
  if (labels.length === 0) throw new Error("README.md: no categories listed under '## Contents'");

  const errors = [];
  const seen = new Map();
  const sectors = labels.map((label) => {
    const start = lines.indexOf(`## ${label}`);
    if (start === -1) {
      errors.push(`category '${label}' is listed in Contents but has no '## ${label}' section`);
      return { id: slugify(label), label, tools: [] };
    }
    const tools = [];
    for (let i = start + 1; i < lines.length && !lines[i].startsWith("## "); i++) {
      const line = lines[i].trim();
      if (!line.startsWith("- ")) continue;
      const m = line.match(ENTRY);
      if (!m) {
        errors.push(`line ${i + 1}: not in '- [Name](https://url) - Description.' format: ${line}`);
        continue;
      }
      const [, name, url, description] = m;
      if (seen.has(url)) errors.push(`line ${i + 1}: ${url} is already listed on line ${seen.get(url)}`);
      seen.set(url, i + 1);
      tools.push([name, url, siteDescription(description), CLIENT_SIDE.test(description)]);
    }
    if (tools.length === 0) errors.push(`category '${label}' has no tools`);
    return { id: slugify(label), label, tools };
  });

  if (errors.length) throw new Error(`README.md has problems:\n  - ${errors.join("\n  - ")}`);
  return sectors;
}

function renderToolsJs(sectors) {
  const q = (s) => JSON.stringify(s);
  const body = sectors
    .map((s) => {
      const tools = s.tools
        .map(([n, u, d, c]) => `    [${q(n)}, ${q(u)}, ${q(d)}, ${c}],`)
        .join("\n");
      return `  { id: ${q(s.id)}, label: ${q(s.label)}, tools: [\n${tools}\n  ]},`;
    })
    .join("\n");
  return (
    "// GENERATED FILE — do not edit by hand.\n" +
    "// Source: README.md. Regenerate with: node scripts/build-site-data.mjs\n" +
    `const SECTORS = [\n${body}\n];\n`
  );
}

function renderIndex(html, sectors) {
  const tools = sectors.flatMap((s) => s.tools);
  const total = tools.length;
  const items = tools
    .map(
      ([name, url], i) =>
        `      { "@type": "ListItem", "position": ${i + 1}, "name": ${JSON.stringify(name)}, "url": ${JSON.stringify(url)} }`
    )
    .join(",\n");

  const itemList = /("numberOfItems": )\d+(,\s*"itemListElement": \[\n)[\s\S]*?(\n\s*\])/;
  if (!itemList.test(html)) throw new Error("index.html: JSON-LD ItemList block not found");

  const out = html
    .replace(itemList, (_, a, b, c) => `${a}${total}${b}${items}${c}`)
    .replace(/\b\d+\+? free tools with zero signup/g, `${total} free tools with zero signup`)
    .replace(/across \d+ searchable categories/g, `across ${sectors.length} searchable categories`)
    .replace(/organized into \d+ categories/g, `organized into ${sectors.length} categories`);
  if (!out.includes(`"url": "${SITE_URL}"`)) throw new Error("index.html: unexpected structure");
  return out;
}

function main() {
  const check = process.argv.includes("--check");
  const sectors = parseReadme(readFileSync(README, "utf8"));

  const outputs = [
    [TOOLS_JS, renderToolsJs(sectors)],
    [INDEX, renderIndex(readFileSync(INDEX, "utf8"), sectors)],
  ];

  const stale = outputs.filter(([file, content]) => {
    let current = "";
    try {
      current = readFileSync(file, "utf8");
    } catch {}
    return current !== content;
  });

  const total = sectors.reduce((n, s) => n + s.tools.length, 0);
  if (check) {
    if (stale.length) {
      console.error(`Out of date: ${stale.map(([f]) => f.slice(ROOT.length + 1)).join(", ")}`);
      console.error("Run: node scripts/build-site-data.mjs");
      process.exit(1);
    }
    console.log(`Site data is in sync with README.md (${total} tools, ${sectors.length} categories).`);
    return;
  }

  for (const [file, content] of stale) writeFileSync(file, content);
  console.log(
    `${total} tools in ${sectors.length} categories; ` +
      (stale.length ? `updated ${stale.map(([f]) => f.slice(ROOT.length + 1)).join(", ")}` : "nothing to update")
  );
}

main();
