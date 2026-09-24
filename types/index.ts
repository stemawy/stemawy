export type Grade = 10 | 11;
export type Semester = 1 | 2;

export type SubjectContentType = "unit" | "qs-bank" | "revision" | "references";

export type ResourceType =
  | "video"
  | "pdf"
  | "file"
  | "document"
  | "slides"
  | "sheet"
  | "test-bank";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  provider: string;
  url: string;
}

export interface Concept {
  id: string;
  title: string;
  description: string;
  resources: string[];
}

export interface SubjectContent {
  id: string;
  type: SubjectContentType;
  number?: string;
  title: string;
  description: string;
  concepts?: Concept[];
  resources: string[];
  showResourceSuggestion?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  grade: string;
  semester: string;
  category: "science" | "languages" | "computing" | "humanities";
  icon: string;
  content: SubjectContent[];
  units: number;
}
