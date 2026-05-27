import { Image } from "antd";
import type { GuideBlock } from "../content/guide-content";

type GuideBlockRendererProps = {
  block: GuideBlock;
};

export function GuideBlockRenderer({ block }: GuideBlockRendererProps) {
  switch (block.type) {
    case "paragraph":
      return <p className="guide-paragraph">{block.text}</p>;
    case "label":
      return <p className="guide-label">{block.text}</p>;
    case "steps":
      return (
        <ol className="guide-steps">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "bullets":
      return (
        <ul className="guide-bullets">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "image":
      return (
        <figure className="guide-figure">
          <div className="screenshot-frame">
            <div className="screenshot-toolbar" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <Image src={block.src} alt={block.alt} loading="lazy" />
          </div>
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      );
    default:
      return null;
  }
}
