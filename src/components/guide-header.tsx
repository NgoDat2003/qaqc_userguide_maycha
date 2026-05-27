import { Button, Tag } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import type { GuideContent } from "../content/guide-content";

type GuideHeaderProps = {
  guide: GuideContent;
};

export function GuideHeader({ guide }: GuideHeaderProps) {
  return (
    <header className="guide-header">
      <div className="guide-header-inner">
        <div className="brand-mark" aria-hidden="true">
          QA
        </div>
        <div className="header-copy">
          <p className="eyebrow">Maycha QA/QC UAT</p>
          <h1>{guide.title}</h1>
          <p className="guide-subtitle">{guide.scope}</p>
          <div className="header-tags" aria-label="Thông tin tài liệu">
            <Tag className="soft-tag gold">Phiên bản {guide.version}</Tag>
            <Tag className="soft-tag blue">{guide.sections.length} mục</Tag>
            <Tag className="soft-tag green">{guide.imageCount} ảnh</Tag>
          </div>
        </div>
        <div className="header-actions">
          <Button
            className="download-button"
            icon={<DownloadOutlined />}
            href={guide.sourceDocument}
            target="_blank"
            rel="noreferrer"
          >
            Tải Word
          </Button>
        </div>
      </div>
    </header>
  );
}
