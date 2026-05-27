import { Alert, Image } from "antd";
import type { GuideContent } from "../content/guide-content";
import { GuideSectionView } from "./guide-section-view";

type GuideContentViewProps = {
  guide: GuideContent;
};

export function GuideContentView({ guide }: GuideContentViewProps) {
  return (
    <article className="document-page">
      <section className="document-cover" aria-labelledby="document-title">
        <div className="cover-main">
          <p className="cover-label">Tài liệu hướng dẫn</p>
          <h2 id="document-title">{guide.title}</h2>
          <p className="cover-summary">
            Bản web để tra cứu nhanh các thao tác vận hành QA/QC UAT cho cửa hàng quản lý nội bộ.
          </p>
        </div>
        <dl>
          <div>
            <dt>Phạm vi</dt>
            <dd>{guide.scope}</dd>
          </div>
          <div>
            <dt>Đối tượng</dt>
            <dd>{guide.audience}</dd>
          </div>
          <div>
            <dt>Phiên bản</dt>
            <dd>{guide.version}</dd>
          </div>
        </dl>
        <Alert className="scope-alert" type="warning" showIcon message={guide.notice} />
      </section>

      <Image.PreviewGroup>
        {guide.sections.map((section) => (
          <GuideSectionView key={section.id} section={section} />
        ))}
      </Image.PreviewGroup>
    </article>
  );
}
