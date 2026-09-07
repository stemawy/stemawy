import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

const CONFIG = {
  subjectId: "socialstudies",
  subjectName: "Social Studies",
  grade: "10",
  semester: "1",
};

const ROOT = process.cwd();

const prefix = `${CONFIG.subjectId}-g${CONFIG.grade}-s${CONFIG.semester}`;

// ─────────────────────────────────────────────
// PATHS
// ─────────────────────────────────────────────

const INPUT = path.join(
  ROOT,
  "migration",
  "raw",
  `g${CONFIG.grade}`,
  `s${CONFIG.semester}`,
  `${CONFIG.subjectId}.json`,
);

const OUTPUT_DIR = path.join(
  ROOT,
  "data",
  "generated",
  "migrated",
  `g${CONFIG.grade}`,
  `s${CONFIG.semester}`,
);

const OUTPUT = path.join(OUTPUT_DIR, `${CONFIG.subjectId}.json`);

const REVIEW_DIR = path.join(
  ROOT,
  "migration",
  "reviews",
  `g${CONFIG.grade}`,
  `s${CONFIG.semester}`,
);

const REVIEW_OUTPUT = path.join(REVIEW_DIR, `${CONFIG.subjectId}.json`);

const MIGRATED_ROOT = path.join(ROOT, "data", "generated", "migrated");

const MIGRATED_INDEX = path.join(MIGRATED_ROOT, "index.ts");

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeId(type, value) {
  return `${prefix}-${type}-${slugify(value)}`;
}

function getFileName(file) {
  if (!file) {
    return "";
  }

  if (typeof file === "string") {
    return path.basename(file);
  }

  if (typeof file === "object") {
    return file.name || file.fileName || file.filename || "";
  }

  return "";
}

function getDriveUrl(file) {
  if (!file) {
    return "";
  }

  if (typeof file === "string") {
    if (file.startsWith("http")) {
      return file;
    }

    return shareMap[file] || shareMap[getFileName(file)] || "";
  }

  if (typeof file === "object") {
    return (
      file.url ||
      file.link ||
      file.href ||
      file.driveUrl ||
      shareMap[file.path] ||
      shareMap[file.legacyPath] ||
      shareMap[getFileName(file)] ||
      ""
    );
  }

  return "";
}

function getYoutubeId(url) {
  if (!url) {
    return null;
  }

  const value = String(url).trim();

  const patterns = [
    /youtu\.be\/([^?&/]+)/i,
    /youtube\.com\/watch\?v=([^?&]+)/i,
    /youtube\.com\/embed\/([^?&/]+)/i,
    /youtube\.com\/shorts\/([^?&/]+)/i,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);

    if (match) {
      return match[1];
    }
  }

  return null;
}

function uniqueIds(ids) {
  return [...new Set(ids)];
}

function asArray(value) {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function normalizeVideoEntries(value, fallbackTitle) {
  return asArray(value)
    .map((entry) => {
      if (typeof entry === "string") {
        return { title: fallbackTitle, url: entry };
      }

      if (entry && typeof entry === "object") {
        return {
          title: entry.title || fallbackTitle,
          url: entry.url || entry.link || entry.video || "",
        };
      }

      return { title: fallbackTitle, url: "" };
    })
    .map((entry) => ({ ...entry, url: String(entry.url).trim() }))
    .filter((entry) => entry.url);
}

function hash(value) {
  return crypto
    .createHash("sha1")
    .update(String(value))
    .digest("hex")
    .slice(0, 10);
}

// ─────────────────────────────────────────────
// LOAD RAW DATA
// ─────────────────────────────────────────────

if (!fs.existsSync(INPUT)) {
  throw new Error(`Input file not found:\n${INPUT}`);
}

const legacy = JSON.parse(fs.readFileSync(INPUT, "utf8"));

// ─────────────────────────────────────────────
// REVIEW REPORT
// ─────────────────────────────────────────────

const review = {
  missingDriveUrls: [],
  missingVideoUrls: [],
  duplicateResourceIds: [],
  deduplicatedResourceIds: [],
  unrecognizedResourceLocations: [],
  notes: [],
  statistics: {
    units: 0,
    concepts: 0,
    resources: 0,
    pdfs: 0,
    videos: 0,
    testBanks: 0,
    missingDriveUrls: 0,
    missingVideoUrls: 0,
    duplicateResourceIds: 0,
  },
};

// ─────────────────────────────────────────────
// RESOURCE REGISTRY
// ─────────────────────────────────────────────

const resources = [];

const resourceByKey = new Map();

const resourceUseCount = new Map();

function registerResource(resource) {
  const key = `${resource.type}::${resource.url}`;

  const existing = resourceByKey.get(key);

  if (existing) {
    const count = (resourceUseCount.get(existing.id) || 1) + 1;

    resourceUseCount.set(existing.id, count);

    return existing.id;
  }

  resources.push(resource);

  resourceByKey.set(key, resource);

  resourceUseCount.set(resource.id, 1);

  return resource.id;
}

// ─────────────────────────────────────────────
// RESOURCE CREATORS
// ─────────────────────────────────────────────

function createPdfResource(
  file,
  location,
  legacyPath = undefined,
  classification = undefined,
) {
  const title = getFileName(file);

  const url = getDriveUrl(file);

  if (!url) {
    review.missingDriveUrls.push({
      title,
      location,
    });
  }

  const fallbackUrl = url || legacyPath || title;

  const id = makeId("pdf", `${title}-${hash(fallbackUrl)}`);

  return registerResource({
    id,
    title,
    type: "pdf",
    provider: url ? "google-drive" : "legacy",
    url: fallbackUrl,

    source: {
      ...(legacyPath ? { legacyPath } : {}),
      location,
    },

    ...(classification ? { classification } : {}),
  });
}

function createVideoResource(url, title, location) {
  if (!url) {
    review.missingVideoUrls.push({
      title,
      location,
    });

    return null;
  }

  const youtubeId = getYoutubeId(url);

  const id = youtubeId
    ? makeId("video", `${youtubeId}-${hash(url)}`)
    : makeId("video", `${title}-${hash(url)}`);

  return registerResource({
    id,
    title,
    type: "video",
    provider: "youtube",
    url,

    ...(youtubeId ? { youtubeId } : {}),

    source: {
      location,
    },
  });
}

// ─────────────────────────────────────────────
// EXTRACT LEGACY STRUCTURES
// ─────────────────────────────────────────────

const learningObjectives = legacy.learningObjectives || {};

const resourceFiles = legacy.resourceFiles || {};

const videoLinks = legacy.videoLinks || {};

const loSummaryVideos = legacy.loSummaryVideos || {};

const revisionVideos = legacy.revisionVideos || [];

const shareMap = legacy.shareMap || {};

const explicitShareMapLinks = legacy.explicitShareMapLinks || [];

const legacyFiles = legacy.files || {};

const legacySections = legacy.sections || {};

function sectionFiles(section) {
  if (Array.isArray(section)) {
    return section;
  }

  return section && typeof section === "object" ? asArray(section.files) : [];
}

const additionalQuestionFiles = [];

const additionalReferenceFiles = [
  ...asArray(resourceFiles.books),
  ...asArray(resourceFiles.livres),
  ...asArray(resourceFiles.summaries),
  ...asArray(resourceFiles.files),
  ...asArray(resourceFiles.references),
  ...sectionFiles(legacyFiles.books),
  ...sectionFiles(legacyFiles.livres),
  ...sectionFiles(legacyFiles.summaries),
  ...sectionFiles(legacyFiles.files),
  ...sectionFiles(legacyFiles.references),
  ...asArray(legacy.capstoneFiles),
  ...sectionFiles(legacySections.books),
  ...sectionFiles(legacySections.livres),
  ...sectionFiles(legacySections.summaries),
  ...sectionFiles(legacySections.files),
  ...sectionFiles(legacySections.references),
];

for (const key of ["questions", "question", "اسألة", "أسئلة"]) {
  additionalQuestionFiles.push(
    ...sectionFiles(legacyFiles[key]),
    ...sectionFiles(legacySections[key]),
  );
}

// ─────────────────────────────────────────────
// UNIT DATA
// ─────────────────────────────────────────────

const units = [];

let unitOrder = 0;

let conceptCount = 0;

for (const [loKey, loData] of Object.entries(learningObjectives)) {
  unitOrder++;

  const unitNumber = String(unitOrder).padStart(2, "0");

  const unitId = makeId("unit", unitNumber);

  const concepts = [];

  const loConcepts = Array.isArray(loData)
    ? loData
    : loData.concepts || loData.items || [];

  let conceptOrder = 0;

  for (const concept of loConcepts) {
    conceptOrder++;

    const title =
      typeof concept === "string"
        ? concept
        : concept.title || concept.name || concept.concept || "";

    if (!title) {
      continue;
    }

    const conceptId = makeId("concept", title);

    const conceptResources = [];

    const nestedConceptVideos =
      typeof concept === "object"
        ? concept.downloads?.video || concept.video || []
        : [];
    const mappedConceptVideos =
      videoLinks?.[loKey]?.[title] ||
      videoLinks?.[loKey]?.[concept.id] ||
      videoLinks?.concept?.[title] ||
      videoLinks?.[title] ||
      [];
    const conceptVideos = [
      ...normalizeVideoEntries(nestedConceptVideos, title),
      ...normalizeVideoEntries(mappedConceptVideos, title),
    ];

    for (const video of conceptVideos) {
      const resourceId = createVideoResource(
        video.url,
        video.title,
        `${loKey} → ${title}`,
      );

      if (resourceId) {
        conceptResources.push(resourceId);
      }
    }

    const conceptFiles =
      typeof concept === "object"
        ? [concept.file, concept.presentation, concept.downloads?.presentation]
            .flatMap((file) => asArray(file))
            .filter(Boolean)
        : [];

    for (const file of conceptFiles) {
      const legacyPath =
        typeof file === "object" ? file.path || file.legacyPath : undefined;
      const resourceId = createPdfResource(
        file,
        `${loKey} → ${title}`,
        legacyPath,
        {
          status: "unclassified",
          unitId,
        },
      );

      if (resourceId) {
        conceptResources.push(resourceId);
      }
    }

    concepts.push({
      id: conceptId,
      title,
      description: typeof concept === "object" ? concept.description || "" : "",
      order: conceptOrder,
      resources: uniqueIds(conceptResources),
    });

    conceptCount++;
  }

  const unitResources = [];

  const structuredBooks = Array.isArray(loData?.bookGroups)
    ? loData.bookGroups.flatMap((group) => group.books || [])
    : [];

  for (const book of structuredBooks) {
    const resourceId = createPdfResource(
      book.file,
      `${loKey} → ${book.title || "Book"}`,
      undefined,
      { status: "classified", contentType: "references" },
    );

    if (resourceId) {
      unitResources.push(resourceId);
    }
  }

  const loFiles = [
    ...asArray(resourceFiles?.[loKey]),
    ...asArray(legacyFiles?.[loKey]),
  ];

  for (const file of Array.isArray(loFiles) ? loFiles : []) {
    const legacyPath =
      typeof file === "object" ? file.path || file.legacyPath : undefined;

    const resourceId = createPdfResource(file, loKey, legacyPath, {
      status: "unclassified",
      unitId,
    });

    if (resourceId) {
      unitResources.push(resourceId);
    }
  }

  // Summary videos belong to the unit,
  // not to a specific concept.

  const summaryVideos = loSummaryVideos?.[loKey] || [];

  for (const video of Array.isArray(summaryVideos)
    ? summaryVideos
    : [summaryVideos]) {
    const url =
      typeof video === "string" ? video : video?.url || video?.link || "";

    const title =
      typeof video === "object"
        ? video.title || `${loKey} Summary`
        : `${loKey} Summary`;

    const resourceId = createVideoResource(url, title, `${loKey} → Summary`);

    if (resourceId) {
      unitResources.push(resourceId);
    }
  }

  units.push({
    id: unitId,
    type: "unit",
    number: unitNumber,

    title: (loData?.title || loData?.name || loKey).replace(/^LO\d+:\s*/i, ""),

    description: loData?.description || "",

    order: unitOrder,

    concepts,

    resources: uniqueIds(unitResources),
  });
}

// ─────────────────────────────────────────────
// QUESTION BANK
// ─────────────────────────────────────────────

const questionBankResources = [];

for (const file of additionalQuestionFiles) {
  const resourceId = createPdfResource(file, "Questions", undefined, {
    status: "classified",
    contentType: "qs-bank",
  });

  if (resourceId) {
    questionBankResources.push(resourceId);
  }
}

for (const link of explicitShareMapLinks) {
  if (!link.file || !link.title) {
    continue;
  }

  const resourceId = createPdfResource(link.file, link.title, undefined, {
    status: "classified",
    contentType: "qs-bank",
  });

  if (resourceId) {
    questionBankResources.push(resourceId);
  }
}

const testBanks = resourceFiles.testBanks || [];

for (const file of Array.isArray(testBanks) ? testBanks : []) {
  const legacyPath =
    typeof file === "object" ? file.path || file.legacyPath : undefined;

  const resourceId = createPdfResource(file, "Question Bank", legacyPath, {
    status: "classified",
    contentType: "qs-bank",
  });

  if (resourceId) {
    questionBankResources.push(resourceId);
  }
}

// ─────────────────────────────────────────────
// REVISION
// ─────────────────────────────────────────────

const revisionResourceIds = [];

const revisionFiles = [
  ...asArray(resourceFiles.revisions),
  ...asArray(legacyFiles.revisions),
  ...asArray(legacyFiles.revision),
];

for (const file of Array.isArray(revisionFiles) ? revisionFiles : []) {
  const legacyPath =
    typeof file === "object" ? file.path || file.legacyPath : undefined;

  const resourceId = createPdfResource(file, "Revision", legacyPath, {
    status: "classified",
    contentType: "revision",
  });

  if (resourceId) {
    revisionResourceIds.push(resourceId);
  }
}

const revisionEntries = Array.isArray(revisionVideos)
  ? [["revision", revisionVideos]]
  : Object.entries(revisionVideos);

for (const [revisionType, videos] of revisionEntries) {
  for (const video of Array.isArray(videos) ? videos : [videos]) {
    const url =
      typeof video === "string" ? video : video?.url || video?.link || "";

    const title =
      typeof video === "object"
        ? video.title || `${revisionType} Revision`
        : `${revisionType} Revision`;

    const resourceId = createVideoResource(
      url,
      title,
      `Revision → ${revisionType}`,
    );

    if (resourceId) {
      revisionResourceIds.push(resourceId);
    }
  }
}

// ─────────────────────────────────────────────
// REFERENCES
// ─────────────────────────────────────────────

const referenceResourceIds = [];

const references = [
  ...asArray(resourceFiles.references),
  ...additionalReferenceFiles,
];

for (const file of Array.isArray(references) ? references : []) {
  const legacyPath =
    typeof file === "object" ? file.path || file.legacyPath : undefined;

  const resourceId = createPdfResource(file, "References", legacyPath, {
    status: "classified",
    contentType: "references",
  });

  if (resourceId) {
    referenceResourceIds.push(resourceId);
  }
}

// ─────────────────────────────────────────────
// CONTENT ITEMS
// ─────────────────────────────────────────────

const content = [
  ...units,

  {
    id: makeId("qs-bank", "question-bank"),

    type: "qs-bank",

    title: "Question Bank",

    description: "Practice questions, test banks, and exam materials.",

    order: units.length + 1,

    concepts: [],

    resources: uniqueIds(questionBankResources),
  },

  {
    id: makeId("revision", "revision"),

    type: "revision",

    title: "Revision",

    description: "Revision materials for the semester.",

    order: units.length + 2,

    concepts: [],

    resources: uniqueIds(revisionResourceIds),
  },

  {
    id: makeId("references", "references"),

    type: "references",

    title: "References",

    description: "Reference books and additional materials.",

    order: units.length + 3,

    concepts: [],

    resources: uniqueIds(referenceResourceIds),
  },
];

// ─────────────────────────────────────────────
// SUBJECT
// ─────────────────────────────────────────────

const subject = {
  id: `${prefix}`,
  name: CONFIG.subjectName,

  description: `${CONFIG.subjectName} resources for Grade ${CONFIG.grade}, Semester ${CONFIG.semester}.`,

  grade: CONFIG.grade,
  semester: CONFIG.semester,

  icon: CONFIG.subjectId,

  content,

  units: units.length,
};

// ─────────────────────────────────────────────
// RESOURCE ID REVIEW
// ─────────────────────────────────────────────

const resourceIdCounts = new Map();

for (const resource of resources) {
  const count = resourceIdCounts.get(resource.id) || 0;

  resourceIdCounts.set(resource.id, count + 1);
}

for (const [id, count] of resourceIdCounts) {
  if (count > 1) {
    review.duplicateResourceIds.push({
      id,
      count,
    });
  }
}

for (const [id, count] of resourceUseCount) {
  if (count > 1) {
    review.deduplicatedResourceIds.push({
      id,
      count,
    });
  }
}

// ─────────────────────────────────────────────
// STATISTICS
// ─────────────────────────────────────────────

review.statistics.units = units.length;

review.statistics.concepts = conceptCount;

review.statistics.resources = resources.length;

review.statistics.pdfs = resources.filter(
  (resource) => resource.type === "pdf",
).length;

review.statistics.videos = resources.filter(
  (resource) => resource.type === "video",
).length;

review.statistics.testBanks = questionBankResources.length;

review.statistics.missingDriveUrls = review.missingDriveUrls.length;

review.statistics.missingVideoUrls = review.missingVideoUrls.length;

review.statistics.duplicateResourceIds = review.duplicateResourceIds.length;

// ─────────────────────────────────────────────
// FINAL OUTPUT
// ─────────────────────────────────────────────

const output = {
  version: 1,

  generatedAt: new Date().toISOString(),

  source: {
    file: `migration/raw/g${CONFIG.grade}/s${CONFIG.semester}/${CONFIG.subjectId}.json`,
  },

  subject,

  resources,
};

// ─────────────────────────────────────────────
// WRITE JSON + REVIEW
// ─────────────────────────────────────────────

fs.mkdirSync(OUTPUT_DIR, {
  recursive: true,
});

fs.mkdirSync(REVIEW_DIR, {
  recursive: true,
});

fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2), "utf8");

fs.writeFileSync(REVIEW_OUTPUT, JSON.stringify(review, null, 2), "utf8");

// ─────────────────────────────────────────────
// GENERATE MIGRATED DATA INDEX
// ─────────────────────────────────────────────

function updateMigratedIndex() {
  if (!fs.existsSync(MIGRATED_ROOT)) {
    return;
  }

  const imports = [];
  const datasetNames = [];

  function walk(directory, relativeDirectory = "") {
    const entries = fs
      .readdirSync(directory, {
        withFileTypes: true,
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (entry.name === "index.ts") {
        continue;
      }

      const fullPath = path.join(directory, entry.name);

      const relativePath = path.join(relativeDirectory, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath, relativePath);

        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith(".json")) {
        continue;
      }

      const relativeImport = "./" + relativePath.replace(/\\/g, "/");

      const baseName = path.basename(entry.name, ".json");

      const variableName = [
        ...relativeDirectory.split(path.sep).filter(Boolean),

        baseName,
      ]
        .join("_")
        .replace(/[^a-zA-Z0-9_$]/g, "_");

      imports.push(`import ${variableName} from "${relativeImport}";`);

      datasetNames.push(variableName);
    }
  }

  walk(MIGRATED_ROOT);

  const outputLines = [
    "// AUTO-GENERATED FILE.",
    "// DO NOT EDIT MANUALLY.",
    "",
    ...imports,
    "",
    "const datasets = [",
    ...datasetNames.map((name) => `  ${name},`),
    "];",
    "",
    "export default datasets;",
    "",
  ];

  fs.writeFileSync(MIGRATED_INDEX, outputLines.join("\n"), "utf8");
}

updateMigratedIndex();

// ─────────────────────────────────────────────
// CONSOLE REPORT
// ─────────────────────────────────────────────

console.log("");
console.log("────────────────────────────────────────");
console.log(" Migration complete");
console.log("────────────────────────────────────────");

console.log(`Subject:       ${CONFIG.subjectName}`);

console.log(`Grade:         ${CONFIG.grade}`);

console.log(`Semester:      ${CONFIG.semester}`);

console.log(`Units:         ${review.statistics.units}`);

console.log(`Concepts:       ${review.statistics.concepts}`);

console.log(`Resources:      ${review.statistics.resources}`);

console.log(`PDFs:           ${review.statistics.pdfs}`);

console.log(`Videos:         ${review.statistics.videos}`);

console.log(`Test Banks:     ${review.statistics.testBanks}`);

console.log(`Missing PDFs:   ${review.statistics.missingDriveUrls}`);

console.log(`Missing Videos: ${review.statistics.missingVideoUrls}`);

console.log(`Duplicate IDs:  ${review.statistics.duplicateResourceIds}`);

console.log("");
console.log(`Output:  ${path.relative(ROOT, OUTPUT)}`);

console.log(`Review:  ${path.relative(ROOT, REVIEW_OUTPUT)}`);

console.log(`Catalog: ${path.relative(ROOT, MIGRATED_INDEX)}`);

console.log("────────────────────────────────────────");
console.log("");
