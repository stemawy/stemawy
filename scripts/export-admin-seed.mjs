import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { opportunities } from "../data/opportunities.ts";
import { skills } from "../data/skills.ts";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = resolve(projectRoot, "data/catalog-seed");

const opportunitySeed = opportunities.map((opportunity, displayOrder) => ({
  id: opportunity.id,
  title: opportunity.title,
  ar_title: opportunity.arTitle,
  description: opportunity.description,
  ar_description: opportunity.arDescription,
  url: opportunity.href,
  image_url:
    opportunity.imageUrl ?? opportunity.bannerImage ?? opportunity.image,
  category: opportunity.category,
  opportunity_type: opportunity.type,
  provider: opportunity.provider,
  field: opportunity.field ?? "",
  eligibility: opportunity.eligibility ?? "",
  location: opportunity.location ?? "",
  deadline: opportunity.deadline ?? "",
  featured: opportunity.featured ?? false,
  is_published: true,
  display_order: displayOrder,
}));

const skillSeed = skills.map((skill, displayOrder) => ({
  id: skill.id,
  title: skill.title,
  ar_title: skill.arTitle,
  description: skill.description,
  ar_description: skill.arDescription,
  url: skill.href,
  action: skill.action,
  ar_action: skill.arAction,
  category: skill.category,
  skill_type: skill.type,
  provider: skill.provider,
  icon: skill.icon,
  is_published: true,
  display_order: displayOrder,
}));

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(
    resolve(outputDirectory, "opportunities.json"),
    `${JSON.stringify(opportunitySeed, null, 2)}\n`,
  ),
  writeFile(
    resolve(outputDirectory, "skills.json"),
    `${JSON.stringify(skillSeed, null, 2)}\n`,
  ),
]);

console.log(
  `Exported ${opportunitySeed.length} opportunities and ${skillSeed.length} skills to data/catalog-seed.`,
);
