import { Button, Tag } from "antd";
import type { GuideContent } from "../content/guide-content";
import type { GuidePhase } from "../content/guide-phases";

type GuideHeaderProps = {
  guide: GuideContent;
  activePhase: GuidePhase;
  sectionCount: number;
  imageCount: number;
};

export function GuideHeader({ guide, activePhase, sectionCount, imageCount }: GuideHeaderProps) {
  return (
    <header className="guide-header">
      <div className="guide-header-inner">
        <div className="brand-mark" aria-hidden="true">
          QA
        </div>
        <div className="header-copy">
          <p className="eyebrow">Maycha QA/QC + Training</p>
          <h1>{guide.title}</h1>
          <p className="guide-subtitle">
            Đang xem: <strong>{activePhase.label}</strong> · {activePhase.chapterRange}
          </p>
          <div className="header-tags" aria-label="Thông tin tài liệu">
            <Tag className="soft-tag gold">Phiên bản {guide.version}</Tag>
            <Tag className="soft-tag blue">{sectionCount} mục trong phần</Tag>
            <Tag className="soft-tag green">{imageCount} ảnh trong phần</Tag>
          </div>
        </div>
        <div className="header-actions">
          <Button
            className="download-button"
            disabled
            aria-label="Bản Word đang cập nhật"
          >
            Bản Word đang cập nhật
          </Button>
        </div>
      </div>
    </header>
  );
}
