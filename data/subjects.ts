import type { Grade, Semester, Subject, SubjectContent } from "@/types";
import { importedSubjects } from "@/data/catalog";

const physicsContent: SubjectContent[] = [
  {
    id: "classical-mechanics",
    type: "unit",
    number: "01",
    title: "Classical Mechanics",
    description:
      "Motion, forces, and Newton's Laws of Motion in one and two dimensions with vectors and equilibrium systems.",
    concepts: [
      {
        id: "motion",
        title: "Motion in One Dimension",
        description:
          "Position, displacement, velocity, acceleration, and kinematic equations.",
        resources: ["resource-001", "resource-002"],
      },
      {
        id: "newton",
        title: "Newton's Laws of Motion",
        description:
          "Inertia, F=ma, action-reaction pairs, and free body diagrams with inclined planes.",
        resources: ["resource-001", "resource-004"],
      },
      {
        id: "circular",
        title: "Circular Motion & Gravitation",
        description:
          "Centripetal force, angular velocity, and orbital mechanics.",
        resources: ["resource-003"],
      },
      {
        id: "friction",
        title: "Friction and Drag Forces",
        description:
          "Static and kinetic coefficients, terminal velocity, and practical applications.",
        resources: [],
      },
    ],
    resources: ["resource-001", "resource-002", "resource-003"],
  },
  {
    id: "work-energy-power",
    type: "unit",
    number: "02",
    title: "Work, Energy & Power",
    description:
      "Understand how forces transfer energy and how power measures the rate of doing work.",
    concepts: [],
    resources: ["resource-004"],
  },
  {
    id: "thermal-physics",
    type: "unit",
    number: "03",
    title: "Thermal Physics",
    description:
      "Temperature, heat, internal energy, and the laws governing thermal systems.",
    concepts: [],
    resources: [],
  },
  {
    id: "waves-sound",
    type: "unit",
    number: "04",
    title: "Waves and Sound",
    description:
      "Explore oscillations, wave behavior, and the physics of sound.",
    concepts: [],
    resources: [],
  },
  {
    id: "electricity",
    type: "unit",
    number: "05",
    title: "Electricity",
    description:
      "Electric charge, current, potential difference, resistance, and circuits.",
    concepts: [],
    resources: [],
  },
  {
    id: "magnetism",
    type: "unit",
    number: "06",
    title: "Magnetism",
    description: "Magnetic fields, forces, and electromagnetic interactions.",
    concepts: [],
    resources: [],
  },
  {
    id: "modern-physics",
    type: "unit",
    number: "07",
    title: "Modern Physics",
    description:
      "An introduction to relativity, quantum ideas, and the structure of matter.",
    concepts: [],
    resources: [],
  },
  {
    id: "qs-bank",
    type: "qs-bank",
    title: "Question Bank",
    description:
      "Practice questions and exam-style problems for Physics Semester 1.",
    resources: ["resource-010", "resource-011"],
  },
  {
    id: "revision",
    type: "revision",
    title: "Revision",
    description: "Revision materials for the semester.",
    resources: ["resource-020"],
  },
  {
    id: "references",
    type: "references",
    title: "References",
    description: "Useful references and additional materials.",
    resources: ["resource-030"],
  },
];

const subjectSeeds = [
  [
    "physics",
    "Physics",
    "Explore the fundamental laws governing matter and energy.",
    "atom",
    physicsContent,
  ],
  [
    "chemistry",
    "Chemistry",
    "Matter, reactions, and atomic structure.",
    "flask",
  ],
  ["biology", "Biology", "Living systems and biological processes.", "leaf"],
  ["geology", "Geology", "Earth systems and minerals.", "globe"],
  ["maths", "Maths", "Algebra, geometry, and trigonometry.", "calculator"],
  ["mechanics", "Mechanics", "Motion, forces, and physical systems.", "gauge"],
  ["arabic", "Arabic", "Classical literature and expression.", "languages"],
  ["english", "English", "Literature and composition.", "languages"],
  ["german", "German", "Language, culture, and communication.", "languages"],
  ["french", "French", "Language, culture, and communication.", "languages"],
  [
    "computer-science",
    "Computer Science",
    "Computational thinking and programming.",
    "code",
  ],
  [
    "religion",
    "Religion",
    "Values, faith, and thoughtful reflection.",
    "landmark",
  ],
  [
    "social-studies",
    "Social Studies",
    "Modern world history and society.",
    "history",
  ],
  [
    "capstone",
    "Capstone",
    "Interdisciplinary research and creative projects.",
    "lightbulb",
  ],
] as const;

function genericContent(name: string, unitCount: number): SubjectContent[] {
  const units = Array.from({ length: unitCount }, (_, index) => ({
    id: `${name.toLowerCase().replaceAll(" ", "-")}-unit-${index + 1}`,
    type: "unit" as const,
    number: String(index + 1).padStart(2, "0"),
    title: `${name} foundations ${index + 1}`,
    description: `Build confidence with the essential ideas and applications from ${name}.`,
    concepts: [],
    resources: [],
  }));

  return [
    ...units,
    {
      id: `${name}-qs-bank`,
      type: "qs-bank" as const,
      title: "Question Bank",
      description: `Practice questions for ${name}.`,
      resources: [],
    },
    {
      id: `${name}-revision`,
      type: "revision" as const,
      title: "Revision",
      description: `Revision materials for ${name}.`,
      resources: [],
    },
    {
      id: `${name}-references`,
      type: "references" as const,
      title: "References",
      description: `Useful references for ${name}.`,
      resources: [],
    },
  ];
}

const prototypeSubjects: Subject[] = [
  ...([10, 11] as Grade[]).flatMap((grade) =>
    ([1, 2] as Semester[]).flatMap((semester) =>
      subjectSeeds.map(([id, name, description, icon, content]) => {
        const subjectName =
          grade === 11 && id === "social-studies" ? "Civics" : name;
        const subjectContent =
          content ?? genericContent(subjectName, id === "capstone" ? 2 : 5);
        const category: Subject["category"] = [
          "physics",
          "chemistry",
          "biology",
          "geology",
          "maths",
          "mechanics",
        ].includes(id)
          ? "science"
          : ["arabic", "english", "german", "french"].includes(id)
            ? "languages"
            : id === "computer-science"
              ? "computing"
              : "humanities";
        return {
          id: `${grade === 11 && id === "social-studies" ? "civics" : id}-grade-${grade}-semester-${semester}`,
          name: subjectName,
          grade: `Grade ${grade}`,
          semester: `Semester ${semester}`,
          category,
          description,
          icon,
          content: subjectContent,
          units: subjectContent.filter((item) => item.type === "unit").length,
        };
      }),
    ),
  ),
];

export const subjects: Subject[] = [
  ...importedSubjects,
  ...prototypeSubjects.filter(
    (subject) =>
      !importedSubjects.some(
        (importedSubject) =>
          importedSubject.name === subject.name &&
          importedSubject.grade === subject.grade &&
          importedSubject.semester === subject.semester,
      ),
  ),
];

export type { Grade, Semester, Subject } from "@/types";

const subjectOrder = [
  "physics",
  "chemistry",
  "biology",
  "geology",
  "maths",
  "mechanics",
  "arabic",
  "english",
  "german",
  "french",
  "computerscience",
  "religion",
  "socialstudies",
  "civics",
  "capstone",
];

function getSubjectOrder(subject: Subject) {
  const subjectKey = subjectOrder.find(
    (key) => subject.id === key || subject.id.startsWith(`${key}-`),
  );

  return subjectKey ? subjectOrder.indexOf(subjectKey) : subjectOrder.length;
}

export function getSubjects(grade: Grade, semester: Semester) {
  return subjects
    .filter(
      (subject) =>
        subject.grade === `Grade ${grade}` &&
        subject.semester === `Semester ${semester}`,
    )
    .sort((first, second) => {
      const orderDifference = getSubjectOrder(first) - getSubjectOrder(second);

      return orderDifference || first.name.localeCompare(second.name);
    });
}
