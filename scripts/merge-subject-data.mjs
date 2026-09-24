import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function dedupeById(items) {
  const map = new Map();

  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const id = String(item.id ?? item.title ?? "").trim();
    if (!id) continue;
    if (!map.has(id)) map.set(id, item);
  }

  return [...map.values()];
}

function mergeLegacyGlobalUnit(item, orderIndex) {
  const resourceIds = Array.isArray(item?.resources)
    ? item.resources
        .map((resource) => String(resource?.id ?? "").trim())
        .filter(Boolean)
    : [];

  return {
    id: String(item?.id ?? `legacy-unit-${orderIndex}`).trim(),
    type: "unit",
    number: String(orderIndex).padStart(2, "0"),
    title: String(item?.title ?? `Unit ${orderIndex}`).trim(),
    description: "",
    order: orderIndex,
    concepts: [],
    resources: [...new Set(resourceIds)],
  };
}

function mergeSubjectData(globalPath, semesterPath, outputPath) {
  const globalData = readJson(globalPath);
  const semesterData = readJson(semesterPath);

  const existingContent = Array.isArray(semesterData?.subject?.content)
    ? semesterData.subject.content.map((item) => ({
        ...item,
        resources: Array.isArray(item.resources)
          ? item.resources.map(String)
          : [],
        concepts: Array.isArray(item.concepts)
          ? item.concepts.map((concept) => ({
              ...concept,
              resources: Array.isArray(concept.resources)
                ? concept.resources.map(String)
                : [],
            }))
          : [],
      }))
    : [];

  const legacyItems = Array.isArray(globalData?.content)
    ? globalData.content
    : [];
  const mergedContentMap = new Map();

  for (const item of [
    ...existingContent,
    ...legacyItems.map((entry, index) =>
      mergeLegacyGlobalUnit(entry, index + 1 + existingContent.length),
    ),
  ]) {
    if (!item || typeof item !== "object") continue;
    const key = String(item.id ?? item.title ?? "").trim();
    if (!key) continue;

    if (!mergedContentMap.has(key)) {
      mergedContentMap.set(key, {
        ...item,
        id: String(item.id ?? key).trim(),
        type: item.type ?? "unit",
        number: String(item.number ?? mergedContentMap.size + 1).padStart(
          2,
          "0",
        ),
        title: String(item.title ?? `Unit ${mergedContentMap.size + 1}`).trim(),
        description: String(item.description ?? "").trim(),
        order: Number(item.order ?? mergedContentMap.size + 1),
        concepts: Array.isArray(item.concepts)
          ? item.concepts.map((concept) => ({
              ...concept,
              id: String(
                concept.id ??
                  `${key}-concept-${Math.random().toString(36).slice(2, 8)}`,
              ).trim(),
              title: String(concept.title ?? "Concept").trim(),
              description: String(concept.description ?? "").trim(),
              resources: Array.isArray(concept.resources)
                ? concept.resources.map((resource) => String(resource))
                : [],
            }))
          : [],
        resources: Array.isArray(item.resources)
          ? [...new Set(item.resources.map((resource) => String(resource)))]
          : [],
      });
      continue;
    }

    const existing = mergedContentMap.get(key);
    existing.resources = [
      ...new Set([
        ...(existing.resources ?? []),
        ...(Array.isArray(item.resources)
          ? item.resources.map((resource) => String(resource))
          : []),
      ]),
    ];
  }

  const mergedContent = [...mergedContentMap.values()].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  const mergedResources = dedupeById([
    ...(Array.isArray(semesterData?.resources) ? semesterData.resources : []),
    ...(Array.isArray(globalData?.resources?.questionBank)
      ? globalData.resources.questionBank
      : []),
    ...(Array.isArray(globalData?.resources?.revision)
      ? globalData.resources.revision
      : []),
  ]);

  const merged = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: {
      file: semesterData?.source?.file ?? "migration/raw/g11/s1/biology.json",
    },
    subject: {
      id: semesterData?.subject?.id ?? "biology-g11-s1",
      name: semesterData?.subject?.name ?? globalData?.subject ?? "Biology",
      description: semesterData?.subject?.description ?? "",
      grade: semesterData?.subject?.grade ?? "11",
      semester: semesterData?.subject?.semester ?? "1",
      icon: semesterData?.subject?.icon ?? "biology",
      content: mergedContent,
      units: mergedContent.length,
    },
    resources: mergedResources,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2));

  return {
    subjectId: merged.subject.id,
    contentUnits: mergedContent.length,
    resources: mergedResources.length,
    output: outputPath,
  };
}

const globalFile = path.join(root, "data/generated/migrated/g11/biology.json");
const semesterFile = path.join(
  root,
  "data/generated/migrated/g11/s1/biology.json",
);
const outputFile = path.join(
  root,
  "data/generated/migrated/g11/s1/biology-merged.json",
);

const summary = mergeSubjectData(globalFile, semesterFile, outputFile);
console.log(JSON.stringify(summary, null, 2));
