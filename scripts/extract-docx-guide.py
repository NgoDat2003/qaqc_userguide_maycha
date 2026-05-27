from __future__ import annotations

import json
import re
import shutil
import unicodedata
from pathlib import Path

from docx import Document
from docx.document import Document as DocumentType
from docx.oxml.ns import qn
from docx.table import Table
from docx.text.paragraph import Paragraph


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DOCX = Path(r"D:\work\maycha\docs\qaqc\huong-dan-su-dung-he-thong-qaqc-uat-27-05-2026.docx")
ASSET_DIR = ROOT / "public" / "assets" / "user-guide"
DOWNLOAD_DIR = ROOT / "public" / "downloads"
CONTENT_DIR = ROOT / "src" / "content"
CONTENT_JSON = CONTENT_DIR / "guide-content.json"

STEP_RE = re.compile(r"^\d+\.\s+(.*)$")
MAIN_HEADING_RE = re.compile(r"^\d+\.\s+")
SUB_HEADING_RE = re.compile(r"^\d+\.\d+\.?\s+")
CAPTION_MAX = 120


def slugify(text: str, fallback: str) -> str:
    normalized = unicodedata.normalize("NFD", text.lower())
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    ascii_text = re.sub(r"[^a-z0-9]+", "-", ascii_text).strip("-")
    return ascii_text[:72].strip("-") or fallback


def iter_blocks(parent: DocumentType):
    body = parent.element.body
    for child in body.iterchildren():
        if child.tag == qn("w:p"):
            yield Paragraph(child, parent)
        elif child.tag == qn("w:tbl"):
            yield Table(child, parent)


def paragraph_images(paragraph: Paragraph) -> list[tuple[str, bytes, str]]:
    images = []
    for blip in paragraph._p.xpath(".//a:blip"):
        rel_id = blip.get(qn("r:embed"))
        if not rel_id:
            continue
        part = paragraph.part.related_parts.get(rel_id)
        if part is None:
            continue
        content_type = getattr(part, "content_type", "image/png")
        extension = {
            "image/jpeg": ".jpg",
            "image/jpg": ".jpg",
            "image/png": ".png",
            "image/gif": ".gif",
            "image/webp": ".webp",
        }.get(content_type, ".png")
        images.append((rel_id, part.blob, extension))
    return images


def table_to_block(table: Table) -> dict:
    rows = []
    for row in table.rows:
        rows.append(["\n".join(p.text.strip() for p in cell.paragraphs).strip() for cell in row.cells])
    rows = [row for row in rows if any(cell for cell in row)]
    if not rows:
        return {"type": "paragraph", "text": ""}
    return {
        "type": "table",
        "headers": rows[0],
        "rows": rows[1:],
    }


def flush_list(target: list[dict], pending: dict | None) -> None:
    if pending and pending["items"]:
        target.append(pending)


def ensure_section(sections: list[dict]) -> dict:
    if not sections:
        sections.append(
            {
                "id": "overview",
                "title": "Tổng quan",
                "level": 1,
                "blocks": [],
            }
        )
    return sections[-1]


def is_caption_candidate(text: str) -> bool:
    if len(text) > CAPTION_MAX:
        return False
    if STEP_RE.match(text) or MAIN_HEADING_RE.match(text) or SUB_HEADING_RE.match(text):
        return False
    lowered = text.lower()
    blocked = {"thao tác", "người dùng thấy", "lưu ý", "thao tác nghiệp vụ", "thao tác từng bước"}
    return lowered not in blocked


def build_content() -> dict:
    doc = Document(str(SOURCE_DOCX))
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)

    for old in ASSET_DIR.glob("*"):
        if old.is_file():
            old.unlink()

    title = ""
    meta_text = ""
    sections: list[dict] = []
    in_toc = False
    image_index = 0
    pending_list: dict | None = None
    pending_image: dict | None = None

    for block in iter_blocks(doc):
        current = ensure_section(sections)
        if isinstance(block, Table):
            if in_toc:
                continue
            flush_list(current["blocks"], pending_list)
            pending_list = None
            current["blocks"].append(table_to_block(block))
            pending_image = None
            continue

        text = block.text.strip()
        style = block.style.name
        images = paragraph_images(block)

        if style == "Title" and text:
            title = text
            continue

        if text == "Mục Lục":
            in_toc = True
            continue

        if in_toc:
            if style.startswith("Heading") and MAIN_HEADING_RE.match(text):
                in_toc = False
            else:
                continue

        if style.startswith("Heading") and text:
            current = ensure_section(sections)
            flush_list(current["blocks"], pending_list)
            pending_list = None
            level = 1 if style == "Heading 1" else 2
            section_id = slugify(text, f"section-{len(sections) + 1}")
            sections.append({"id": section_id, "title": text, "level": level, "blocks": []})
            pending_image = None
            continue

        current = ensure_section(sections)

        if images:
            flush_list(current["blocks"], pending_list)
            pending_list = None
            for _, blob, extension in images:
                image_index += 1
                filename = f"figure-{image_index:03d}{extension}"
                (ASSET_DIR / filename).write_bytes(blob)
                image_block = {
                    "type": "image",
                    "src": f"/assets/user-guide/{filename}",
                    "alt": f"Hình minh họa {image_index:03d}",
                }
                current["blocks"].append(image_block)
                pending_image = image_block
            continue

        if not text:
            continue

        if pending_image and is_caption_candidate(text):
            pending_image["alt"] = text
            pending_image["caption"] = text
            pending_image = None
            continue

        pending_image = None

        if not sections and text.startswith("Phiên bản:"):
            meta_text = text
            continue
        if text.startswith("Phiên bản:") and not meta_text:
            meta_text = text
            continue

        step_match = STEP_RE.match(text)
        if step_match:
            if not pending_list or pending_list["type"] != "steps":
                flush_list(current["blocks"], pending_list)
                pending_list = {"type": "steps", "items": []}
            pending_list["items"].append(step_match.group(1).strip())
            continue

        if style == "List Bullet" or text.startswith("- "):
            item = text[2:].strip() if text.startswith("- ") else text
            if not pending_list or pending_list["type"] != "bullets":
                flush_list(current["blocks"], pending_list)
                pending_list = {"type": "bullets", "items": []}
            pending_list["items"].append(item)
            continue

        flush_list(current["blocks"], pending_list)
        pending_list = None
        if text.lower() in {"thao tác", "người dùng thấy", "lưu ý", "thao tác nghiệp vụ", "thao tác từng bước"}:
            current["blocks"].append({"type": "label", "text": text})
        else:
            current["blocks"].append({"type": "paragraph", "text": text})

    current = ensure_section(sections)
    flush_list(current["blocks"], pending_list)

    shutil.copy2(SOURCE_DOCX, DOWNLOAD_DIR / SOURCE_DOCX.name)

    return {
        "title": title or "Hướng Dẫn Sử Dụng Hệ Thống QA/QC UAT",
        "version": "27/05/2026",
        "scope": "Hệ thống QA/QC UAT cho cửa hàng quản lý/nội bộ",
        "audience": "Admin, QA Manager, QC Audit, AM, Store Manager",
        "notice": "Luồng cửa hàng nhượng quyền/Franchise đang phát triển. Tài liệu này chỉ hướng dẫn thao tác chính cho cửa hàng quản lý/nội bộ.",
        "sourceDocument": f"/downloads/{SOURCE_DOCX.name}",
        "imageCount": image_index,
        "sections": sections,
    }


def main() -> None:
    content = build_content()
    CONTENT_JSON.write_text(json.dumps(content, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {CONTENT_JSON}")
    print(f"Images: {content['imageCount']}")
    print(f"Sections: {len(content['sections'])}")


if __name__ == "__main__":
    main()
