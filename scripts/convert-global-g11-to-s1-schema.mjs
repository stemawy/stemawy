import fs from "node:fs";
import path from "node:path";

const files = ["chemistry", "geology", "mathematics", "mechanics", "physics"];
const rootDir = path.join(
  process.cwd(),
  "data",
  "generated",
  "migrated",
  "g11",
);

function slugify(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeResource(entry, fallbackId) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const id = String(entry.id ?? fallbackId).trim() || fallbackId;
  const title = String(entry.title ?? fallbackId).trim() || fallbackId;
  const type = String(entry.type ?? "document").trim() || "document";
  const url = String(entry.url ?? "").trim();

  if (!url) {
    return null;
  }

  return {
    id,
    title,
    type: type === "file" ? "file" : type,
    provider: String(entry.provider ?? "Google Drive").trim() || "Google Drive",
    url,
  };
}

for (const file of files) {
  const filePath = path.join(rootDir, `${file}.json`);
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const rawSubject = raw.subject;
  const subjectName =
    typeof rawSubject === "string"
      ? rawSubject.trim()
      : rawSubject && typeof rawSubject === "object" && "name" in rawSubject
        ? String(rawSubject.name ?? file)
        : file;

  const normalizedName =
    file === "mathematics" ? "Maths" : String(subjectName).trim();
  const subjectId =
    file === "mathematics"
      ? "maths-g11-s1"
      : `${slugify(normalizedName)}-g11-s1`;

  const resourceMap = new Map();
  const flatLegacyResources = Array.isArray(raw.resources)
    ? raw.resources
    : Array.isArray(raw.resources?.questionBank)
      ? [
          ...(raw.resources.questionBank ?? []),
          ...(raw.resources.revision ?? []),
        ]
      : [];

  for (const entry of flatLegacyResources.flatMap((item) =>
    Array.isArray(item) ? item : [item],
  )) {
    const normalized = normalizeResource(entry, `${subjectId}-legacy-resource`);
    if (!normalized) continue;
    resourceMap.set(normalized.id, normalized);
  }

  const content = Array.isArray(raw.content)
    ? raw.content.map((item, index) => {
        const itemResources = Array.isArray(item?.resources)
          ? item.resources
          : [];
        const convertedResources = [];

        itemResources.forEach((resourceEntry, resourceIndex) => {
          const normalized = normalizeResource(
            resourceEntry,
            `${subjectId}-global-${String(index + 1).padStart(2, "0")}-${String(resourceIndex + 1).padStart(2, "0")}`,
          );

          if (!normalized) return;
          resourceMap.set(normalized.id, normalized);
          convertedResources.push(normalized.id);
        });

        return {
          id: String(
            item?.id ??
              `${subjectId}-unit-${String(index + 1).padStart(2, "0")}`,
          ),
          type: "unit",
          number: String(index + 1).padStart(2, "0"),
          title: String(item?.title ?? `Unit ${index + 1}`).trim(),
          description: "",
          order: index + 1,
          concepts: [],
          resources: Array.from(new Set(convertedResources)),
        };
      })
    : [];

  const output = {
    version: 1,
    generatedAt: String(raw.generatedAt ?? new Date().toISOString()),
    source: {
      file: `migration/raw/g11/${file}.json`,
    },
    subject: {
      id: subjectId,
      name: normalizedName,
      description: "",
      grade: "11",
      semester: "1",
      icon: file === "mathematics" ? "maths" : slugify(normalizedName),
      content,
    },
    resources: Array.from(resourceMap.values()),
  };

  fs.writeFileSync(filePath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Converted ${file}.json to ${subjectId}`);
}
