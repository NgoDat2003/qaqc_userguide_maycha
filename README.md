# qaqc_userguide_maycha

Standalone web version of the reviewed Maycha QA/QC UAT user guide.

## Scope

- Independent guide app.
- Does not modify or import the outsource QA/QC UAT codebase.
- No login, API, database, or environment variables.
- Content source: `D:\work\maycha\docs\qaqc\huong-dan-su-dung-he-thong-qaqc-uat-27-05-2026.docx`.

## Local Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Refresh Content From Word

Run this after updating the reviewed Word file:

```bash
python scripts/extract-docx-guide.py
```

The script regenerates:

- `src/content/guide-content.json`
- `public/assets/user-guide/*`
- `public/downloads/huong-dan-su-dung-he-thong-qaqc-uat-27-05-2026.docx`

## Vercel

Deploy this folder as a standalone Vercel project:

- Root directory: repo root / leave blank when importing `qaqc_userguide_maycha`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
