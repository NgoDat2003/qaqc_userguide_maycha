import type { GuideSection } from "../content/guide-content";
import { GuideBlockRenderer } from "./guide-block-renderer";

type GuideSectionViewProps = {
  section: GuideSection;
};

export function GuideSectionView({ section }: GuideSectionViewProps) {
  const Heading = section.level === 1 ? "h2" : "h3";

  return (
    <section id={section.id} className={`guide-section level-${section.level}`}>
      <Heading>{section.title}</Heading>
      <div className="section-body">
        {section.blocks.map((block, index) => (
          <GuideBlockRenderer key={`${section.id}-${index}`} block={block} />
        ))}
      </div>
    </section>
  );
}
