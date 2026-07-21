import { Alert, Image } from "antd";
import type { GuideContent, GuideSection } from "../content/guide-content";
import type { GuidePhase } from "../content/guide-phases";
import { GuideSectionView } from "./guide-section-view";

type GuideContentViewProps = {
  guide: GuideContent;
  sections: GuideSection[];
  phase: GuidePhase;
};

export function GuideContentView({ guide, sections, phase }: GuideContentViewProps) {
  return (
    <article className="document-page" id={phase.id}>
      <section className="document-cover" aria-labelledby="document-title">
        <div className="cover-main">
          <p className="cover-label">Tài liệu hướng dẫn · {phase.label}</p>
          <h2 id="document-title">{guide.title}</h2>
          <p className="cover-summary">{phase.summary}</p>
        </div>
        <dl>
          <div>
            <dt>Đang xem</dt>
            <dd>{phase.label}</dd>
          </div>
          <div>
            <dt>Nội dung</dt>
            <dd>{phase.chapterRange}</dd>
          </div>
          <div>
            <dt>Phiên bản</dt>
            <dd>{guide.version}</dd>
          </div>
        </dl>
        <Alert className="scope-alert" type="warning" showIcon message={guide.notice} />
      </section>

      <Image.PreviewGroup>
        {sections.map((section) => (
          <GuideSectionView key={section.id} section={section} />
        ))}
      </Image.PreviewGroup>
    </article>
  );
}