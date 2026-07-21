import { useMemo, useState } from "react";
import { Button, Drawer } from "antd";
import { DownOutlined, MenuOutlined, RightOutlined } from "@ant-design/icons";
import type { GuideSection } from "../content/guide-content";
import {
  GUIDE_PHASES,
  getGuidePhase,
  getSectionsForPhase,
  type GuidePhaseId,
} from "../content/guide-phases";

type MobileTocProps = {
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

export function MobileToc({
  sections,
  activePhaseId,
  expandedPhaseId,
  activeSectionId,
  onPhaseSelect,
  onPhaseToggle,
  onSectionSelect,
}: MobileTocProps) {
  const [open, setOpen] = useState(false);
  const tocItemsByPhase = useMemo(
    () => new Map<GuidePhaseId, TocItem[]>(
      GUIDE_PHASES.map((phase) => [
        phase.id,
        buildTocItems(getSectionsForPhase(sections, phase.id)),
      ]),
    ),
    [sections],
  );
  const activePhase = getGuidePhase(activePhaseId);

  const selectPhase = (phaseId: GuidePhaseId) => {
    onPhaseSelect(phaseId);
    setOpen(false);
  };

  const selectSection = (sectionId: string) => {
    onSectionSelect(sectionId);
    setOpen(false);
  };

  return (
    <div className="mobile-toc">
      <Button className="mobile-toc-button" icon={<MenuOutlined />} onClick={() => setOpen(true)}>
        {activePhase.label}
      </Button>
      <Drawer
        title={`Mục lục · ${activePhase.shortLabel}`}
        placement="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        <nav className="mobile-toc-list" aria-label="Mục lục tài liệu trên thiết bị di động">
          {GUIDE_PHASES.map((phase) => {
            const isActive = phase.id === activePhaseId;
            const isExpanded = phase.id === expandedPhaseId;
            const panelId = `mobile-${phase.id}-chapters`;
            const tocItems = tocItemsByPhase.get(phase.id) ?? [];

            return (
              <div className={`mobile-phase-group ${isExpanded ? "expanded" : ""}`} key={phase.id}>
                <div className="mobile-phase-header">
                  <button
                    className={`mobile-phase-button mobile-phase-select ${isActive ? "active" : ""}`}
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => selectPhase(phase.id)}
                  >
                    <span>
                      <strong>{phase.label}</strong>
                      <small>{phase.chapterRange}</small>
                    </span>
                  </button>
                  <button
                    className="mobile-phase-toggle"
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
                  <div className="mobile-phase-children" id={panelId}>
                    {tocItems.map((item) => (
                      <div className="mobile-chapter-group" key={item.id}>
                        <button
                          className={`mobile-toc-link level-1 ${activeSectionId === item.id ? "active" : ""}`}
                          type="button"
                          aria-current={activeSectionId === item.id ? "location" : undefined}
                          onClick={() => selectSection(item.id)}
                        >
                          {item.title}
                        </button>
                        {item.children.map((child) => (
                          <button
                            className={`mobile-toc-link level-2 ${activeSectionId === child.id ? "active" : ""}`}
                            type="button"
                            key={child.id}
                            aria-current={activeSectionId === child.id ? "location" : undefined}
                            onClick={() => selectSection(child.id)}
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
        </nav>
      </Drawer>
    </div>
  );
}