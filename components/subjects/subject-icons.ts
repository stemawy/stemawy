import {
  Atom,
  BookOpen,
  BookText,
  Calculator,
  Code2,
  Cog,
  Dna,
  FlaskConical,
  Gauge,
  Globe2,
  History,
  Landmark,
  Languages,
  Leaf,
  Lightbulb,
  Mountain,
  Orbit,
  PenLine,
  Scale,
  Sigma,
  TestTube2,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { createElement } from "react";
import type { CSSProperties } from "react";

import type { Subject } from "@/data/subjects";

const fallbackIcons: Record<string, LucideIcon> = {
  atom: Atom,
  flask: FlaskConical,
  leaf: Leaf,
  globe: Globe2,
  calculator: Calculator,
  gauge: Gauge,
  languages: Languages,
  code: Code2,
  landmark: Landmark,
  history: History,
  lightbulb: Lightbulb,
};

const gradeIcons: Record<string, { grade10: LucideIcon; grade11: LucideIcon }> =
  {
    physics: { grade10: Atom, grade11: Orbit },
    chemistry: { grade10: FlaskConical, grade11: TestTube2 },
    biology: { grade10: Leaf, grade11: Dna },
    geology: { grade10: Globe2, grade11: Mountain },
    maths: { grade10: Calculator, grade11: Sigma },
    mechanics: { grade10: Gauge, grade11: Cog },
    arabic: { grade10: Languages, grade11: BookText },
    english: { grade10: BookOpen, grade11: PenLine },
    german: { grade10: Languages, grade11: BookText },
    french: { grade10: Languages, grade11: PenLine },
    "computer-science": { grade10: Code2, grade11: Terminal },
    religion: { grade10: Landmark, grade11: Scale },
    "social-studies": { grade10: History, grade11: Landmark },
    civics: { grade10: History, grade11: Landmark },
    capstone: { grade10: Lightbulb, grade11: Orbit },
  };

function getSubjectKey(subject: Subject) {
  const knownKey = Object.keys(gradeIcons).find((key) =>
    subject.id.startsWith(`${key}-`),
  );

  return knownKey ?? subject.icon;
}

const subjectColors: Record<string, CSSProperties> = {
  physics: { backgroundColor: "#dbeafe", color: "#1d4ed8" },
  chemistry: { backgroundColor: "#ffedd5", color: "#c2410c" },
  biology: { backgroundColor: "#dcfce7", color: "#15803d" },
  geology: { backgroundColor: "#ccfbf1", color: "#0f766e" },
  maths: { backgroundColor: "#e0e7ff", color: "#4338ca" },
  mechanics: { backgroundColor: "#e2e8f0", color: "#334155" },
  arabic: { backgroundColor: "#ffe4e6", color: "#be123c" },
  english: { backgroundColor: "#f3e8ff", color: "#7e22ce" },
  german: { backgroundColor: "#ccfbf1", color: "#0f766e" },
  french: { backgroundColor: "#ffe4e6", color: "#be123c" },
  "computer-science": { backgroundColor: "#cffafe", color: "#0e7490" },
  religion: { backgroundColor: "#fef3c7", color: "#b45309" },
  "social-studies": { backgroundColor: "#fef3c7", color: "#b45309" },
  civics: { backgroundColor: "#fef3c7", color: "#b45309" },
  capstone: { backgroundColor: "#ffe4e6", color: "#c2410c" },
};

export function getSubjectIcon(subject: Subject): LucideIcon {
  const icons = gradeIcons[getSubjectKey(subject)];

  if (icons) {
    return subject.grade === "Grade 11" ? icons.grade11 : icons.grade10;
  }

  return fallbackIcons[subject.icon] ?? BookOpen;
}

export function renderSubjectIcon(subject: Subject, size: number) {
  return createElement(getSubjectIcon(subject), { size });
}

export function getSubjectColorStyle(subject: Subject): CSSProperties {
  return subjectColors[getSubjectKey(subject)] ?? subjectColors.physics;
}
