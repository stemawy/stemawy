import type { Resource } from "@/types";
import { importedResources } from "@/data/catalog";

const prototypeResources: Resource[] = [
  {
    id: "resource-001",
    title: "Mechanics overview",
    type: "video",
    provider: "45m YouTube",
    url: "#",
  },
  {
    id: "resource-002",
    title: "Unit 1 Formula Sheet",
    type: "document",
    provider: "12 pages Google Drive",
    url: "#",
  },
  {
    id: "resource-003",
    title: "Kinematics slides",
    type: "slides",
    provider: "38 slides PDF",
    url: "#",
  },
  {
    id: "resource-004",
    title: "Work and energy practice",
    type: "sheet",
    provider: "24 questions Google Drive",
    url: "#",
  },
  {
    id: "resource-010",
    title: "Physics practice questions",
    type: "test-bank",
    provider: "Google Drive",
    url: "#",
  },
  {
    id: "resource-011",
    title: "Semester 1 mock exam",
    type: "document",
    provider: "PDF download",
    url: "#",
  },
  {
    id: "resource-020",
    title: "Full semester revision guide",
    type: "document",
    provider: "18 pages PDF",
    url: "#",
  },
  {
    id: "resource-030",
    title: "Physics reference handbook",
    type: "document",
    provider: "OpenStax",
    url: "#",
  },
];

export const resources: Resource[] = [
  ...prototypeResources,
  ...importedResources,
];

export function getResources(ids: string[]) {
  return ids
    .map((id) => resources.find((resource) => resource.id === id))
    .filter((resource): resource is Resource => Boolean(resource));
}
