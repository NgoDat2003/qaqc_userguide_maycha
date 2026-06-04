---
title: Viet lai QAQC user guide web 2026
description: >-
  Viet lai ban huong dan web QA/QC theo flow moi: dashboard 5 role, audit 0
  diem, export Excel, auto confirm 48h, bu diem audit plan.
status: completed
priority: P2
branch: feat/audit-plan-score-backfill
tags:
  - user-guide
  - documentation-web
  - qaqc
blockedBy: []
blocks: []
created: '2026-06-03T09:51:29.277Z'
createdBy: 'ck:plan'
source: skill
---

# Viet lai QAQC user guide web 2026

## Overview

Viet lai website user guide thanh ban moi, khong con dua vao noi dung Word cu lam nguon chinh. Lan nay uu tien code/content web truoc: nguoi dung doc vao phai hieu cach su dung app QA/QC theo flow hien tai, co anh moi, co luu y nghiep vu, va tach ro cac tinh nang moi da build.

Pham vi chi nam trong `outputs/qaqc-user-guide-web`. Thu muc nay dang bi ignore trong repo Maycha QAQC chinh, dung y do se day len repo user guide rieng sau. Khong tao Word trong dot nay.

Nguyen tac noi dung moi:
- Moi feature quan trong viet theo format: Muc dich, Ai dung, Cach thao tac, Nguoi dung se thay gi, Luu y nghiep vu, Anh minh hoa.
- Anh dashboard cu phai thay bang anh moi da chup, dac biet dashboard QAM/AM/QC/SM va mobile SM.
- Noi dung nghiep vu moi phai noi ro: multi-select filter, brand loc cua hang, audit 0 diem khong tinh loi, export Excel theo filter, SM auto confirm sau 48h, bu diem chi cho store chua co diem trong plan open.
- Word tinh sau; khong chay script extract tu Word cu trong phase code nay.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Map content and assets](./phase-01-map-content-and-assets.md) | Completed |
| 2 | [Rewrite guide content](./phase-02-rewrite-guide-content.md) | Completed |
| 3 | [Polish guide UI](./phase-03-polish-guide-ui.md) | Completed |
| 4 | [Verify local guide](./phase-04-verify-local-guide.md) | Completed |
| 5 | [Prepare Word handoff later](./phase-05-prepare-word-handoff-later.md) | Completed |

## Dependencies

- Doc anh da co: `outputs/qaqc-user-guide-web/public/assets/user-guide/2026-06-feature-update/full-image-audit-report.md`
- Noi dung hien tai: `outputs/qaqc-user-guide-web/src/content/guide-content.json`
- Renderer hien tai: `outputs/qaqc-user-guide-web/src/components/guide-block-renderer.tsx`
- Style hien tai: `outputs/qaqc-user-guide-web/src/styles.css`

## Definition of Done

- Website user guide moi build duoc local.
- Tat ca anh duoc tham chieu ton tai va hien thi dung.
- Dashboard 5 role duoc cap nhat theo UI/filter moi.
- Cac flow moi ngay 01/06/2026 duoc viet ro theo nghiep vu va thao tac.
- Khong update Word, khong commit vao repo Maycha QAQC chinh.
- Co ghi chu ro rang de sau nay trien Word tu noi dung web moi.
