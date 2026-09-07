import fs from "fs";
import path from "path";
import vm from "vm";

// =========================================================
// CONFIG — CHANGE ONLY THIS
// =========================================================

const CONFIG = {
  subjectId: "socialstudies",
  grade: "10",
  semester: "1",
};

// =========================================================
// Derived paths — DO NOT CHANGE
// =========================================================

const PROJECT_ROOT = process.cwd();

const LEGACY_DIR = path.join(
  PROJECT_ROOT,
  "legacy",
  `g${CONFIG.grade}`,
  `s${CONFIG.semester}`,
);

const RAW_OUTPUT_DIR = path.join(
  PROJECT_ROOT,
  "migration",
  "raw",
  `g${CONFIG.grade}`,
  `s${CONFIG.semester}`,
);

const INPUT_FILE = path.join(LEGACY_DIR, `${CONFIG.subjectId}.html`);

const OUTPUT_FILE = path.join(RAW_OUTPUT_DIR, `${CONFIG.subjectId}.json`);

// =========================================================
// Read legacy HTML
// =========================================================

if (!fs.existsSync(INPUT_FILE)) {
  console.error(`
Legacy file not found:

${INPUT_FILE}
`);

  process.exit(1);
}

const html = fs.readFileSync(INPUT_FILE, "utf8");

console.log(`Reading:\n${INPUT_FILE}\n`);

// =========================================================
// Find a JavaScript variable declaration
// =========================================================

function extractVariable(source, variableName) {
  const declaration = new RegExp(`(?:const|let|var)\\s+${variableName}\\s*=`);

  const match = declaration.exec(source);

  if (!match) {
    throw new Error(`Could not find ${variableName}`);
  }

  let start = match.index + match[0].length;

  // Skip whitespace
  while (start < source.length && /\s/.test(source[start])) {
    start++;
  }

  // We expect an object or array
  if (source[start] !== "{" && source[start] !== "[") {
    throw new Error(`${variableName}: expected an object or array`);
  }

  const opening = source[start];
  const closing = opening === "{" ? "}" : "]";

  let depth = 0;
  let inString = false;
  let stringCharacter = null;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = start; i < source.length; i++) {
    const char = source[i];
    const nextChar = source[i + 1];

    if (inLineComment) {
      if (char === "\n") {
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === "*" && nextChar === "/") {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    // -----------------------------------------------------
    // Inside string
    // -----------------------------------------------------

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === stringCharacter) {
        inString = false;
        stringCharacter = null;
      }

      continue;
    }

    // -----------------------------------------------------
    // Start string
    // -----------------------------------------------------

    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      stringCharacter = char;
      continue;
    }

    if (char === "/" && nextChar === "/") {
      inLineComment = true;
      i++;
      continue;
    }

    if (char === "/" && nextChar === "*") {
      inBlockComment = true;
      i++;
      continue;
    }

    // -----------------------------------------------------
    // Opening bracket
    // -----------------------------------------------------

    if (char === opening) {
      depth++;
      continue;
    }

    // -----------------------------------------------------
    // Closing bracket
    // -----------------------------------------------------

    if (char === closing) {
      depth--;

      if (depth === 0) {
        return source.slice(start, i + 1);
      }
    }
  }

  throw new Error(`Could not find the end of ${variableName}`);
}

// =========================================================
// Safely evaluate a JavaScript literal
// =========================================================

function evaluateLiteral(code, variableName) {
  try {
    return vm.runInNewContext(
      `(${code})`,
      {},
      {
        timeout: 1000,
      },
    );
  } catch (error) {
    throw new Error(`Failed to parse ${variableName}: ${error.message}`);
  }
}

// =========================================================
// Generic array extractor
// =========================================================

function extractArrayFromPosition(source, start) {
  let depth = 0;
  let inString = false;
  let stringCharacter = null;
  let escaped = false;

  for (let i = start; i < source.length; i++) {
    const char = source[i];

    // -----------------------------------------------------
    // Inside string
    // -----------------------------------------------------

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === stringCharacter) {
        inString = false;
        stringCharacter = null;
      }

      continue;
    }

    // -----------------------------------------------------
    // Start string
    // -----------------------------------------------------

    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      stringCharacter = char;
      continue;
    }

    // -----------------------------------------------------
    // Array
    // -----------------------------------------------------

    if (char === "[") {
      depth++;
      continue;
    }

    if (char === "]") {
      depth--;

      if (depth === 0) {
        return source.slice(start, i + 1);
      }
    }
  }

  throw new Error("Could not find the end of the array");
}

// =========================================================
// Extract data
// =========================================================

const variables = [
  "learningObjectives",
  "resourceFiles",
  "files",
  "sections",
  "capstoneFiles",
  "videoLinks",
  "loSummaryVideos",
  "revisionVideos",
  "shareMap",
];

const data = {};

function extractExplicitShareMapLinks(source) {
  const links = [];
  const pattern =
    /shareMap\[(['"])(.*?)\1\][\s\S]{0,500}?<span[^>]*>([^<]+)<\/span>/g;

  for (const match of source.matchAll(pattern)) {
    links.push({
      file: match[2],
      title: match[3].trim(),
    });
  }

  return links;
}

for (const variable of variables) {
  console.log(`Extracting ${variable}...`);

  try {
    const code = extractVariable(html, variable);

    data[variable] = evaluateLiteral(code, variable);

    console.log("  ✓ success");
  } catch (error) {
    console.error(`  ERROR: ${error.message}`);
  }
}

data.explicitShareMapLinks = extractExplicitShareMapLinks(html);

// =========================================================
// Handle:
// resourceFiles.testBanks = [...]
// =========================================================

console.log("\nExtracting resourceFiles.testBanks...");

try {
  const testBanksMatch = /resourceFiles\s*\.\s*testBanks\s*=\s*/.exec(html);

  if (!testBanksMatch) {
    throw new Error("Could not find resourceFiles.testBanks");
  }

  let start = testBanksMatch.index + testBanksMatch[0].length;

  while (start < html.length && /\s/.test(html[start])) {
    start++;
  }

  if (html[start] !== "[") {
    throw new Error("Expected an array for resourceFiles.testBanks");
  }

  const code = extractArrayFromPosition(html, start);

  data.resourceFiles.testBanks = evaluateLiteral(
    code,
    "resourceFiles.testBanks",
  );

  console.log("  ✓ success");
} catch (error) {
  console.error(`  ERROR: ${error.message}`);
}

// =========================================================
// Create output directory
// =========================================================

fs.mkdirSync(RAW_OUTPUT_DIR, {
  recursive: true,
});

// =========================================================
// Write JSON
// =========================================================

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), "utf8");

// =========================================================
// Report
// =========================================================

console.log("\n========================================");
console.log("Legacy extraction complete!");
console.log("========================================\n");

console.log(`Subject:  ${CONFIG.subjectId}`);
console.log(`Grade:    ${CONFIG.grade}`);
console.log(`Semester: ${CONFIG.semester}`);

console.log(`\nInput:\n${INPUT_FILE}`);
console.log(`\nOutput:\n${OUTPUT_FILE}\n`);

console.log("Extracted:");

for (const [name, value] of Object.entries(data)) {
  if (Array.isArray(value)) {
    console.log(`  ${name}: ${value.length} entries`);
  } else if (value && typeof value === "object") {
    console.log(`  ${name}: ${Object.keys(value).length} entries`);
  } else {
    console.log(`  ${name}: extracted`);
  }
}

console.log("");
