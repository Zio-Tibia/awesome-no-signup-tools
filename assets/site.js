const CATEGORIES = [
  { id: "utilities", label: "Utilities", tools: [
    ["CharCount", "https://charcount.app/", "Free character, word, and text counter with support for 11 languages.", true],
    ["TinyURL", "https://tinyurl.com/", "Shortens a long URL into a short link, no signup required for a single link.", false],
    ["Speedtest by Ookla", "https://www.speedtest.net/", "Tests internet connection speed (download, upload, ping).", false],
    ["goQR.me", "https://goqr.me/", "Generates QR codes in PNG, EPS, and SVG.", false],
    ["RANDOM.ORG", "https://www.random.org/", "True random number, sequence, and password generator (free tools).", false],
    ["Audio Cutter Online", "https://audiocutter.online/", "Cuts, trims, joins, and fades audio; exports MP3, WAV, FLAC, OGG, M4A, AIFF.", true],
    ["FreeToolHub", "https://freetoolhub.org/", "190+ free calculators and file utilities covering tax, finance, PDF and image work.", true],
    ["BuildEstimate", "https://buildestimate.xyz/", "Construction material calculators — concrete, brick, paint, tile, gravel — with bag counts and waste allowance.", true],
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
    ["draw.io", "https://app.diagrams.net/", "Free diagramming tool for flowcharts; can save files locally with no server storage.", true],
    ["World Time Buddy", "https://www.worldtimebuddy.com/", "Time zone converter and meeting planner.", false],
    ["Desmos", "https://www.desmos.com/scientific", "Free scientific and graphing calculator.", false],
    ["MindMup", "https://www.mindmup.com/", "Browser-based mind mapping tool.", false],
    ["Privnote", "https://privnote.com/", "Creates a self-destructing note that deletes itself after being read once.", false],
    ["TryCalculatingNow", "https://trycalculatingnow.com/", "GPA, final grade, percentage, and compound-interest calculators.", false],
    ["Corbelworks", "https://corbelworks.pages.dev/tools/", "Calculators for contractors — billable rate, change-order cost, bid go/no-go.", true],
    ["Naratake Free Business Tools", "https://naratake.com/en/tools", "35 tools for small businesses — QR codes, printable signs, menus, pricing calculators.", true],
  ]},
  { id: "privacy", label: "Privacy", tools: [
    ["Bitwarden Password Generator", "https://bitwarden.com/password-generator/", "Generates strong random passwords and passphrases.", true],
    ["Have I Been Pwned", "https://haveibeenpwned.com/", "Checks whether an email or password has appeared in a known data breach.", false],
    ["SSL Server Test", "https://www.ssllabs.com/ssltest/", "Deep analysis of a domain's SSL/TLS configuration, by Qualys.", false],
    ["VirusTotal", "https://www.virustotal.com/", "Scans a file or URL against dozens of antivirus engines.", false],
    ["Cover Your Tracks", "https://coveryourtracks.eff.org/", "Tests how well your browser is protected from tracking and fingerprinting (EFF).", false],
    ["Metadata Remover", "https://metadataremover.ai/", "Inspects and removes supported file metadata locally in the browser.", true],
  ]},
  { id: "converters", label: "Converters", tools: [
    ["Squoosh", "https://squoosh.app/", "Image compression and format conversion tool, by Google, via WebAssembly.", true],
    ["TinyPNG", "https://tinypng.com/", "Compresses PNG, JPEG, and WebP images (free tier: 20 images/batch, 5MB each).", false],
    ["CloudConvert", "https://cloudconvert.com/", "Converts between 200+ document, image, audio, video, and archive formats.", false],
    ["PDF24 Tools", "https://tools.pdf24.org/en/", "Merges, splits, compresses, and converts PDFs (processed on PDF24's servers).", false],
    ["TryQuickImg", "https://tryquickimg.com/", "HEIC to JPG, compress to a KB target, resize, crop, and QR tools.", true],
    ["AVIF to JPG Converter", "https://nutilz.com/avif-to-jpg", "Converts AVIF images to JPG in bulk with a quality slider and Retina scaling.", true],
  ]},
  { id: "text-writing", label: "Text & Writing", tools: [
    ["Hemingway Editor", "https://hemingwayapp.com/", "Highlights hard-to-read sentences and suggests simpler alternatives.", true],
    ["LanguageTool", "https://languagetool.org/", "Grammar, spelling, and style checker supporting 30+ languages.", false],
    ["DeepL Translate", "https://www.deepl.com/translator", "Machine translation across 30+ languages.", false],
    ["Google Translate", "https://translate.google.com/", "Machine translation across 100+ languages.", false],
    ["Duplicate Line Remover", "https://nutilz.com/duplicate-line-remover", "Removes duplicate lines from text, lists, or logs.", true],
    ["Need Go Home", "https://needgohome.netlify.app/", "Generates short, professional messages for leaving work early, in multiple languages.", true],
  ]},
];

function buildToolRow([name, url, description, clientSide]) {
  const row = document.createElement("div");
  row.className = "row";
  row.dataset.search = `${name} ${description}`.toLowerCase();

  const nameCell = document.createElement("div");
  nameCell.className = "name";
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = name;
  nameCell.append(link);

  const descCell = document.createElement("div");
  descCell.className = "desc";
  descCell.textContent = description;

  const tagsCell = document.createElement("div");
  tagsCell.className = "tags";
  tagsCell.append(makeTag("open", "OPEN · NO SIGNUP"));
  if (clientSide) tagsCell.append(makeTag("client", "CLIENT-SIDE"));

  row.append(nameCell, descCell, tagsCell);
  return row;
}

function makeTag(kind, label) {
  const tag = document.createElement("span");
  tag.className = `tag ${kind}`;
  tag.textContent = label;
  return tag;
}

function buildBoard(category, index) {
  const section = document.createElement("section");
  section.className = "board";
  section.id = `board-${category.id}`;
  section.dataset.cat = category.id;

  const head = document.createElement("div");
  head.className = "board-head";

  const boardNo = document.createElement("span");
  boardNo.className = "board-no mono";
  boardNo.textContent = `BOARD ${String(index + 1).padStart(2, "0")}`;

  const heading = document.createElement("h2");
  heading.textContent = category.label;

  const count = document.createElement("span");
  count.className = "board-count mono";
  count.textContent = `${category.tools.length} open`;

  head.append(boardNo, heading, count);
  section.append(head);

  for (const tool of category.tools) {
    section.append(buildToolRow(tool));
  }

  return section;
}

function buildNavLink(category) {
  const link = document.createElement("a");
  link.href = `#board-${category.id}`;
  link.textContent = category.label;
  return link;
}

function renderDirectory() {
  const boardsEl = document.getElementById("boards");
  const navEl = document.getElementById("catnav");

  let totalTools = 0;
  let totalClientSide = 0;

  CATEGORIES.forEach((category, index) => {
    totalTools += category.tools.length;
    totalClientSide += category.tools.filter((tool) => tool[3]).length;

    navEl.append(buildNavLink(category));
    boardsEl.append(buildBoard(category, index));
  });

  document.getElementById("stat-tools").textContent = totalTools;
  document.getElementById("stat-boards").textContent = CATEGORIES.length;
  document.getElementById("stat-client").textContent = totalClientSide;

  return totalTools;
}

function setUpSearch(totalTools) {
  const input = document.getElementById("search");
  const status = document.getElementById("search-status");

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    let shown = 0;

    document.querySelectorAll(".board").forEach((board) => {
      let boardHasMatch = false;
      board.querySelectorAll(".row").forEach((row) => {
        const isMatch = !query || row.dataset.search.includes(query);
        row.hidden = !isMatch;
        if (isMatch) {
          boardHasMatch = true;
          shown += 1;
        }
      });
      board.hidden = !boardHasMatch;
    });

    status.textContent = query
      ? `Showing ${shown} of ${totalTools} tools for “${input.value.trim()}”`
      : "";
  });
}

const totalTools = renderDirectory();
setUpSearch(totalTools);
