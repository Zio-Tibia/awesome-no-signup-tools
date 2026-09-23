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
