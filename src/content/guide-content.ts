import guideContent from "./guide-content.json";

export type GuideBlock =
  | { type: "paragraph"; text: string }
  | { type: "label"; text: string }
  | { type: "steps"; items: string[] }
  | { type: "bullets"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "image"; src: string; alt: string; caption?: string };

export type GuideSection = {
  id: string;
  title: string;
  level: 1 | 2;
  blocks: GuideBlock[];
};

export type GuideContent = {
  title: string;
  version: string;
  scope: string;
  audience: string;
  notice: string;
  sourceDocument: string;
  imageCount: number;
  sections: GuideSection[];
};

export const guide = guideContent as GuideContent;
