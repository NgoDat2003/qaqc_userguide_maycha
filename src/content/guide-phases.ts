import type { GuideSection } from "./guide-content";

export type GuidePhaseId = "phase-1" | "phase-2";

export type GuidePhase = {
  id: GuidePhaseId;
  label: string;
  shortLabel: string;
  chapterRange: string;
  firstChapter: number;
  lastChapter: number;
  summary: string;
};

export const GUIDE_PHASES: readonly GuidePhase[] = [
  {
    id: "phase-1",
    label: "Phần 1 — QA/QC",
    shortLabel: "QA/QC",
    chapterRange: "Chương 1–11",
    firstChapter: 1,
    lastChapter: 11,
    summary: "Hướng dẫn vận hành QA/QC từ thiết lập dữ liệu, lập kế hoạch, thực hiện audit đến xác nhận điểm và Action Plan.",
  },
  {
    id: "phase-2",
    label: "Phần 2 — Training",
    shortLabel: "Training",
    chapterRange: "Chương 12–20",
    firstChapter: 12,
    lastChapter: 20,
    summary: "Hướng dẫn nghiệp vụ Training Phase 2 theo vai trò, từ phân công đến thực hiện bài, kết quả, xác nhận điểm và Action Plan.",
  },
] as const;

export function getSectionChapterNumber(section: GuideSection): number | null {
  const match = section.title.trim().match(/^(\d+)(?:\.|\s)/);
  return match ? Number(match[1]) : null;
}

export function getGuidePhase(phaseId: GuidePhaseId): GuidePhase {
  return GUIDE_PHASES.find((phase) => phase.id === phaseId) ?? GUIDE_PHASES[0];
}

export function getPhaseForSection(section: GuideSection): GuidePhaseId {
  const chapterNumber = getSectionChapterNumber(section);
  return chapterNumber !== null && chapterNumber >= 12 ? "phase-2" : "phase-1";
}

export function getSectionsForPhase(sections: GuideSection[], phaseId: GuidePhaseId): GuideSection[] {
  const phase = getGuidePhase(phaseId);

  return sections.filter((section) => {
    const chapterNumber = getSectionChapterNumber(section);
    return (
      chapterNumber !== null &&
      chapterNumber >= phase.firstChapter &&
      chapterNumber <= phase.lastChapter
    );
  });
}

export function getPhaseFromHash(sections: GuideSection[], hash: string): GuidePhaseId {
  const targetId = decodeURIComponent(hash.replace(/^#/, ""));
  const directPhase = GUIDE_PHASES.find((phase) => phase.id === targetId);
  if (directPhase) return directPhase.id;

  const targetSection = sections.find((section) => section.id === targetId);
  return targetSection ? getPhaseForSection(targetSection) : "phase-1";
}

export function countSectionImages(sections: GuideSection[]): number {
  return sections.reduce(
    (total, section) =>
      total + section.blocks.filter((block) => block.type === "image").length,
    0,
  );
}
