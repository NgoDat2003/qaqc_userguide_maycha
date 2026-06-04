---
phase: 5
title: Prepare Word handoff later
status: completed
priority: P3
effort: 0.25d
dependencies:
  - 4
---

# Phase 5: Prepare Word handoff later

## Overview

Chuan bi de sau nay xuat/lam Word tu noi dung web moi, nhung khong trien Word trong dot code nay. Muc tieu la khong de script Word cu ghi de lai guide moi.

## Requirements

- Functional: co ghi chu ro cach dong bo Word sau.
- Non-functional: khong lam phat sinh file Word trong scope hien tai.

## Architecture

Hien app co script `extract:guide` de lay noi dung tu Word cu. Sau khi rewrite web bang tay, script nay co nguy co ghi de `guide-content.json`. Can ghi ro quy tac su dung.

## Related Code Files

- Read: `outputs/qaqc-user-guide-web/package.json`
- Optional create later: `outputs/qaqc-user-guide-web/docs/word-handoff-notes.md`
- Do not modify now unless implementation phase needs note in repo.

## Implementation Steps

1. Ghi chu trong handoff:
   - Web guide moi la source tam thoi cho ban moi.
   - Khong chay `npm run extract:guide` cho den khi Word source moi duoc cap nhat.
2. Tao danh sach anh can chen vao Word sau:
   - Dashboard 5 role.
   - Audit plan missing score.
   - Audit 0 diem.
   - Result export Excel.
   - SM mobile/action plan/notification.
3. Tao mapping chuong web -> muc Word sau:
   - De khi lam Word chi can copy theo cau truc da chot.
4. Ghi lai unresolved items neu co:
   - Cot Excel chinh thuc neu QA/QC chua gui form.
   - Anh nao can chup lai neu UI app tiep tuc thay doi.

## Success Criteria

- [ ] Co note ro rang "Word tinh sau".
- [ ] Biet file/section nao la nguon khi trien Word.
- [ ] Khong lam thay doi Word cu trong dot nay.

## Risk Assessment

- Risk: Sau nay ai do chay extractor Word cu lam mat guide moi.
  Mitigation: ghi warning trong handoff va/hoac README user guide khi implement.
