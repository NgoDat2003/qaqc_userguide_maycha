import { useMemo } from "react";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import type { GuideSection } from "../content/guide-content";
import {
  GUIDE_PHASES,
  getSectionsForPhase,
  type GuidePhaseId,
} from "../content/guide-phases";

type GuideSidebarProps = {
  sections: GuideSection[];
  activePhaseId: GuidePhaseId;
  expandedPhaseId: GuidePhaseId | null;
  activeSectionId: string;
  onPhaseSelect: (phaseId: GuidePhaseId) => void;
  onPhaseToggle: (phaseId: GuidePhaseId) => void;
  onSectionSelect: (sectionId: string) => void;
};

type TocItem = GuideSection & {
  children: GuideSection[];
};

function buildTocItems(sections: GuideSection[]): TocItem[] {
  const items: TocItem[] = [];
  let currentParent: TocItem | undefined;

  for (const section of sections) {
    if (section.level === 1 || !currentParent) {
      currentParent = { ...section, children: [] };
      items.push(currentParent);
      continue;
    }

    currentParent.children.push(section);
  }

  return items;
}

export function GuideSidebar({
  sections,
  activePhaseId,
  expandedPhaseId,
  activeSectionId,
  onPhaseSelect,
  onPhaseToggle,
  onSectionSelect,
}: GuideSidebarProps) {
  const tocItemsByPhase = useMemo(
    () => new Map<GuidePhaseId, TocItem[]>(
      GUIDE_PHASES.map((phase) => [
        phase.id,
        buildTocItems(getSectionsForPhase(sections, phase.id)),
      ]),
    ),
    [sections],
  );

  return (
    <aside className="guide-sidebar">
      <div className="toc-card">
        <div className="toc-header">
          <span className="toc-kicker">Nội dung</span>
          <div className="toc-title">Mục lục</div>
          <p>Chọn tên phần để mở nội dung; dùng nút mũi tên để thu gọn hoặc xem nhanh mục lục.</p>
        </div>
        <nav className="toc-nav" aria-label="Mục lục tài liệu">
          <div className="toc-phase-list">
            {GUIDE_PHASES.map((phase) => {
              const isActive = phase.id === activePhaseId;
              const isExpanded = phase.id === expandedPhaseId;
              const panelId = `desktop-${phase.id}-chapters`;
              const tocItems = tocItemsByPhase.get(phase.id) ?? [];

              return (
                <div className={`toc-phase-group ${isExpanded ? "expanded" : ""}`} key={phase.id}>
                  <div className="toc-phase-header">
                    <button
                      className={`toc-phase-button toc-phase-select ${isActive ? "active" : ""}`}
                      type="button"
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => onPhaseSelect(phase.id)}
                    >
                      <span className="toc-phase-copy">
                        <span>{phase.label}</span>
                        <small>{phase.chapterRange}</small>
                      </span>
                    </button>
                    <button
                      className="toc-phase-toggle"
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      aria-label={`${isExpanded ? "Thu gọn" : "Mở rộng"} ${phase.label}`}
                      onClick={() => onPhaseToggle(phase.id)}
                    >
                      {isExpanded ? <DownOutlined aria-hidden="true" /> : <RightOutlined aria-hidden="true" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="toc-phase-children" id={panelId}>
                      {tocItems.map((item) => (
                        <div className="toc-group" key={item.id}>
                          <button
                            className={`toc-link level-1 ${activeSectionId === item.id ? "active" : ""}`}
                            type="button"
                            aria-current={activeSectionId === item.id ? "location" : undefined}
                            onClick={() => onSectionSelect(item.id)}
                          >
                            {item.title}
                          </button>
                          {item.children.map((child) => (
                            <button
                              className={`toc-link level-2 ${activeSectionId === child.id ? "active" : ""}`}
                              type="button"
                              key={child.id}
                              aria-current={activeSectionId === child.id ? "location" : undefined}
                              onClick={() => onSectionSelect(child.id)}
                            >
                              {child.title}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}