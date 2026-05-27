import { useMemo, useState } from "react";
import { Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import type { GuideSection } from "../content/guide-content";

type MobileTocProps = {
  sections: GuideSection[];
};

export function MobileToc({ sections }: MobileTocProps) {
  const [open, setOpen] = useState(false);
  const topSections = useMemo(() => sections.filter((section) => section.level === 1), [sections]);

  return (
    <div className="mobile-toc">
      <Button className="mobile-toc-button" icon={<MenuOutlined />} onClick={() => setOpen(true)}>
        Mục lục
      </Button>
      <Drawer title="Mục lục" placement="left" open={open} onClose={() => setOpen(false)}>
        <nav className="mobile-toc-list">
          {topSections.map((section) => (
            <a key={section.id} href={`#${section.id}`} onClick={() => setOpen(false)}>
              {section.title}
            </a>
          ))}
        </nav>
      </Drawer>
    </div>
  );
}
