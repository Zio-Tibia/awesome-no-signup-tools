const SECTORS = [
  { id: "utilities", label: "Utilities", tools: [
    ["CharCount", "https://charcount.app/", "Free character, word, and text counter with support for 11 languages.", true],
    ["TinyURL", "https://tinyurl.com/", "Shortens a long URL into a short link, no signup required for a single link.", false],
    ["Speedtest by Ookla", "https://www.speedtest.net/", "Tests internet connection speed (download, upload, ping).", false],
    ["goQR.me", "https://goqr.me/", "Generates QR codes in PNG, EPS, and SVG.", false],
    ["RANDOM.ORG", "https://www.random.org/", "True random number, sequence, and password generator (free tools).", false],
    ["Audio Cutter Online", "https://audiocutter.online/", "Cuts, trims, joins, and fades audio; exports MP3, WAV, FLAC, OGG, M4A, AIFF.", true],
    ["FreeToolHub", "https://freetoolhub.org/", "190+ free calculators and file utilities covering tax, finance, PDF and image work.", true],
    ["BuildEstimate", "https://buildestimate.xyz/", "Construction material calculators — concrete, brick, paint, tile, gravel.", true],
  ]},
  { id: "devtools", label: "DevTools", tools: [
    ["Diffchecker", "https://www.diffchecker.com/", "Compare text, files, images, or JSON side-by-side.", false],
    ["Regex101", "https://regex101.com/", "Regex tester and debugger with real-time explanation.", true],
    ["JSFiddle", "https://jsfiddle.net/", "Online HTML/CSS/JS code editor and playground.", false],
    ["JSONLint", "https://jsonlint.com/", "Validates and reformats JSON.", false],
    ["Can I Use", "https://caniuse.com/", "Browser support tables for HTML5, CSS3, and other web technologies.", false],
    ["TryDevSnip", "https://trydevsnip.com/", "JSON formatter, cron helper, timestamps, JWT, and hash tools.", true],
  ]},
  { id: "design", label: "Design", tools: [
    ["Photopea", "https://www.photopea.com/", "Photoshop-like editor that opens PSD, XD, and Sketch files directly in the browser.", true],
    ["Excalidraw", "https://excalidraw.com/", "Free virtual whiteboard for sketches and diagrams, open-source.", true],
    ["Coolors", "https://coolors.co/", "Color palette generator (saving palettes requires an account).", false],
    ["Google Fonts", "https://fonts.google.com/", "Browse and download open-source fonts.", false],
    ["Unsplash", "https://unsplash.com/", "Browse and download free high-resolution stock photos.", false],
  ]},
  { id: "productivity", label: "Productivity", tools: [
    ["Pomofocus", "https://pomofocus.io/", "Customizable Pomodoro timer with task tracking.", false],
    ["World Time Buddy", "https://www.worldtimebuddy.com/", "Time zone converter and meeting planner.", false],
    ["Desmos", "https://www.desmos.com/scientific", "Free scientific and graphing calculator.", false],
    ["MindMup", "https://www.mindmup.com/", "Browser-based mind mapping tool.", false],
    ["Privnote", "https://privnote.com/", "Creates a self-destructing note that deletes itself after being read once.", false],
    ["TryCalculatingNow", "https://trycalculatingnow.com/", "GPA, final grade, percentage, and compound-interest calculators.", false],
    ["Corbelworks", "https://corbelworks.pages.dev/tools/", "Calculators for contractors — billable rate, change-order cost, bid go/no-go.", true],
    ["Naratake Free Business Tools", "https://naratake.com/en/tools", "35 tools for small businesses — QR codes, signs, menus, pricing.", true],
  ]},
  { id: "privacy", label: "Privacy", tools: [
    ["SSL Server Test", "https://www.ssllabs.com/ssltest/", "Deep analysis of a domain's SSL/TLS configuration, by Qualys.", false],
    ["VirusTotal", "https://www.virustotal.com/", "Scans a file or URL against dozens of antivirus engines.", false],
    ["Cover Your Tracks", "https://coveryourtracks.eff.org/", "Tests how well your browser is protected from tracking (EFF).", false],
    ["Metadata Remover", "https://metadataremover.ai/", "Inspects and removes supported file metadata locally in the browser.", true],
  ]},
  { id: "converters", label: "Converters", tools: [
    ["TinyPNG", "https://tinypng.com/", "Compresses PNG, JPEG, and WebP images (free tier: 20 images/batch).", false],
    ["CloudConvert", "https://cloudconvert.com/", "Converts between 200+ document, image, audio, video, and archive formats.", false],
    ["PDF24 Tools", "https://tools.pdf24.org/en/", "Merges, splits, compresses, and converts PDFs (processed server-side).", false],
    ["TryQuickImg", "https://tryquickimg.com/", "HEIC to JPG, compress to a KB target, resize, crop, and QR tools.", true],
    ["AVIF to JPG Converter", "https://nutilz.com/avif-to-jpg", "Converts AVIF images to JPG in bulk with a quality slider.", true],
  ]},
  { id: "text-writing", label: "Text & Writing", tools: [
    ["LanguageTool", "https://languagetool.org/", "Grammar, spelling, and style checker supporting 30+ languages.", false],
    ["DeepL Translate", "https://www.deepl.com/translator", "Machine translation across 30+ languages.", false],
    ["Google Translate", "https://translate.google.com/", "Machine translation across 100+ languages.", false],
    ["Duplicate Line Remover", "https://nutilz.com/duplicate-line-remover", "Removes duplicate lines from text, lists, or logs.", true],
    ["Need Go Home", "https://needgohome.netlify.app/", "Generates short, professional leave-early messages, in multiple languages.", true],
  ]},
];

const ACCESS_LOG_KEY = "signal-deck:access-log";
// Fallback for when localStorage is blocked (private browsing, sandboxed preview) —
// counts still update for the current tab even though they won't persist.
const memoryAccessLog = {};

function readAccessLog() {
  try {
    return JSON.parse(localStorage.getItem(ACCESS_LOG_KEY)) || {};
  } catch {
    return { ...memoryAccessLog };
  }
}

function recordAccess(url) {
  memoryAccessLog[url] = (memoryAccessLog[url] || 0) + 1;
  try {
    const log = readAccessLog();
    log[url] = memoryAccessLog[url];
    localStorage.setItem(ACCESS_LOG_KEY, JSON.stringify(log));
  } catch {
    // memory fallback above already recorded this click
  }
  return memoryAccessLog[url];
}

function frequencyClass(count) {
  if (count >= 7) return "freq-3";
  if (count >= 3) return "freq-2";
  if (count >= 1) return "freq-1";
  return "";
}

function makeBars(clientSide) {
  const wrap = document.createElement("span");
  wrap.className = clientSide ? "bars full" : "bars";
  for (let i = 0; i < 4; i++) wrap.append(document.createElement("i"));
  return wrap;
}

function buildToolRow([name, url, description, clientSide], accessLog) {
  const row = document.createElement("div");
  row.className = "row";
  row.dataset.search = `${name} ${description}`.toLowerCase();
  row.dataset.url = url;

  const count = accessLog[url] || 0;
  const freqClass = frequencyClass(count);
  if (freqClass) row.classList.add(freqClass);

  const nameCell = document.createElement("div");
  nameCell.className = "name";

  const isDofollow = new URL(url).hostname === "charcount.app";

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = isDofollow ? "noopener" : "noopener nofollow";
  link.textContent = name;
  link.addEventListener("click", () => {
    const newCount = recordAccess(url);
    row.className = `row just-logged ${frequencyClass(newCount)}`.trim();
    updateAccessBadge(row, newCount);
    setTimeout(() => row.classList.remove("just-logged"), 650);
  });
  nameCell.append(link);

  if (count > 0) {
    const badge = document.createElement("span");
    badge.className = "access-count mono";
    badge.textContent = `×${count}`;
    nameCell.append(badge);
  }

  const descCell = document.createElement("div");
  descCell.className = "desc";
  descCell.textContent = description;

  const tagsCell = document.createElement("div");
  tagsCell.className = clientSide ? "signal-tag full" : "signal-tag";
  const label = document.createElement("span");
  label.className = "signal-label mono";
  label.textContent = clientSide ? "LOCAL" : "UPLINK";
  tagsCell.append(label, makeBars(clientSide));

  row.append(nameCell, descCell, tagsCell);
  return row;
}

function updateAccessBadge(row, count) {
  const nameCell = row.querySelector(".name");
  let badge = nameCell.querySelector(".access-count");
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "access-count mono";
    nameCell.append(badge);
  }
  badge.textContent = `×${count}`;
}

function buildSectorIndex(total, position) {
  const wrap = document.createElement("div");
  wrap.className = "sector-index";
  for (let i = 0; i < total; i++) {
    const seg = document.createElement("span");
    if (i <= position) seg.className = "on";
    wrap.append(seg);
  }
  return wrap;
}

function buildSector(sector, index, total) {
  const section = document.createElement("section");
  section.className = "sector";
  section.id = `sector-${sector.id}`;
  section.dataset.cat = sector.id;

  const headWrap = document.createElement("div");
  headWrap.className = "sector-head";
  headWrap.append(buildSectorIndex(total, index));

  const titleRow = document.createElement("div");
  titleRow.className = "sector-title-row";

  const no = document.createElement("span");
  no.className = "sector-no mono";
  no.textContent = `SECTOR ${String(index + 1).padStart(2, "0")}`;

  const h2 = document.createElement("h2");
  h2.textContent = sector.label;

  const count = document.createElement("span");
  count.className = "sector-count mono";
  count.textContent = `${sector.tools.length} entries`;

  titleRow.append(no, h2, count);
  headWrap.append(titleRow);
  section.append(headWrap);

  const accessLog = readAccessLog();
  for (const tool of sector.tools) {
    section.append(buildToolRow(tool, accessLog));
  }

  return section;
}

function buildNavLink(sector) {
  const link = document.createElement("a");
  link.href = `#sector-${sector.id}`;
  link.textContent = sector.label;
  return link;
}

function renderDeck() {
  const sectorsEl = document.getElementById("sectors");
  const navEl = document.getElementById("sectornav");

  let totalTools = 0;
  let totalLocal = 0;

  SECTORS.forEach((sector, index) => {
    totalTools += sector.tools.length;
    totalLocal += sector.tools.filter((tool) => tool[3]).length;
    navEl.append(buildNavLink(sector));
    sectorsEl.append(buildSector(sector, index, SECTORS.length));
  });

  document.getElementById("stat-tools").textContent = totalTools;
  document.getElementById("stat-sectors").textContent = SECTORS.length;
  document.getElementById("stat-local").textContent = totalLocal;

  return totalTools;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function startClock() {
  const clockEl = document.getElementById("clock");
  const tick = () => {
    const d = new Date();
    clockEl.textContent = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`;
  };
  tick();
  setInterval(tick, 1000);

  const now = new Date();
  document.getElementById("stat-sync").textContent =
    `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`;
}

function setUpSearch(totalTools) {
  const input = document.getElementById("search");
  const status = document.getElementById("query-status");

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    let shown = 0;

    document.querySelectorAll(".sector").forEach((sector) => {
      let sectorHasMatch = false;
      sector.querySelectorAll(".row").forEach((row) => {
        const isMatch = !query || row.dataset.search.includes(query);
        row.hidden = !isMatch;
        if (isMatch) {
          sectorHasMatch = true;
          shown += 1;
        }
      });
      sector.hidden = !sectorHasMatch;
    });

    status.textContent = query
      ? `MATCHED ${shown} / ${totalTools} FOR "${input.value.trim().toUpperCase()}"`
      : "";
  });
}

function logConsoleBanner() {
  console.log(
    "%c SIGNAL_DECK ",
    "background:#57E8CE;color:#04231D;font-family:monospace;font-weight:700;padding:2px 8px;border-radius:3px;"
  );
  console.log(
    "%cYou found the console. No signup required here either.\nSource: https://github.com/Zio-Tibia/awesome-no-signup-tools",
    "color:#9AACBB;font-family:monospace;font-size:12px;"
  );
}

const KONAMI_SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

function setUpKonamiCode() {
  let progress = 0;

  window.addEventListener("keydown", (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    progress = key === KONAMI_SEQUENCE[progress] ? progress + 1 : 0;

    if (progress === KONAMI_SEQUENCE.length) {
      progress = 0;
      runKonamiSequence();
    }
  });
}

function runKonamiSequence() {
  const rows = document.querySelectorAll(".row:not([hidden])");
  rows.forEach((row, i) => {
    setTimeout(() => {
      row.classList.add("just-logged");
      setTimeout(() => row.classList.remove("just-logged"), 650);
    }, i * 25);
  });

  const toast = document.createElement("div");
  toast.className = "konami-toast mono";
  toast.textContent = "ACCESS LEVEL: NERD — welcome to the deck";
  document.body.append(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

const totalTools = renderDeck();
startClock();
setUpSearch(totalTools);
logConsoleBanner();
setUpKonamiCode();
