import { useEffect, useMemo, useState } from "react";
import type { GuideSection } from "../content/guide-content";

type GuideSidebarProps = {
  sections: GuideSection[];
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

function jumpToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ block: "start", behavior: "auto" });
  window.history.replaceState(null, "", `#${sectionId}`);
}

export function GuideSidebar({ sections }: GuideSidebarProps) {
  const tocItems = useMemo(() => buildTocItems(sections), [sections]);
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-12% 0px -72% 0px", threshold: 0.01 },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <aside className="guide-sidebar">
      <div className="toc-card">
        <div className="toc-header">
          <span className="toc-kicker">Nội dung</span>
          <div className="toc-title">Mục lục</div>
          <p>{tocItems.length} phần chính, bấm để chuyển nhanh trong tài liệu.</p>
        </div>
        <nav className="toc-nav" aria-label="Mục lục tài liệu">
          {tocItems.map((item) => (
            <div className="toc-group" key={item.id}>
              <button
                className={`toc-link level-1 ${activeId === item.id ? "active" : ""}`}
                type="button"
                onClick={() => {
                  setActiveId(item.id);
                  jumpToSection(item.id);
                }}
              >
                {item.title}
              </button>
              {item.children.map((child) => (
                <button
                  className={`toc-link level-2 ${activeId === child.id ? "active" : ""}`}
                  type="button"
                  key={child.id}
                  onClick={() => {
                    setActiveId(child.id);
                    jumpToSection(child.id);
                  }}
                >
                  {child.title}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
