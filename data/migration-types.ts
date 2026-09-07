import type { Concept, Resource, Subject, SubjectContent } from "@/types";

export type MigratedConcept = Omit<Concept, "resources"> & {
  order: number;
  resources: string[];
};

export type MigratedContent = Omit<SubjectContent, "concepts" | "resources"> & {
  order: number;
  concepts: MigratedConcept[];
  resources: string[];
};

export type MigratedResource = Resource & {
  youtubeId?: string;

  source?: {
    legacyPath?: string;
    location: string;
  };

  classification?: {
    status: "unclassified" | "classified";
    unitId?: string;
    contentType?: "qs-bank" | "revision" | "references";
  };
};

export type MigratedSubject = Omit<Subject, "content"> & {
  content: MigratedContent[];
};

export type MigratedDataset = {
  version: number;

  generatedAt: string;

  source: {
    file: string;
  };

  subject: MigratedSubject;

  resources: MigratedResource[];
};
