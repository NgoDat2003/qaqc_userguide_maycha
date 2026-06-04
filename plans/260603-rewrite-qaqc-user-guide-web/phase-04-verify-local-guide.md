---
phase: 4
title: Verify local guide
status: completed
priority: P1
effort: 0.5d
dependencies:
  - 2
  - 3
---

# Phase 4: Verify local guide

## Overview

Build va chay local guide de kiem tra nhu nguoi dung doc that: menu dung, anh dung, khong broken path, khong noi dung cu gay lech nghiep vu.

## Requirements

- Functional: website build thanh cong va browse duoc.
- Non-functional: kiem tra bang mat voi desktop/mobile, uu tien anh va flow nghiep vu.

## Architecture

Dung script san co trong package user guide. Khong can API/database vi guide la site tinh.

## Related Code Files

- Read: `outputs/qaqc-user-guide-web/package.json`
- Verify: `outputs/qaqc-user-guide-web/src/content/guide-content.json`
- Verify: `outputs/qaqc-user-guide-web/public/assets/user-guide/**`

## Implementation Steps

1. Chay build user guide:
   - `npm run build` trong `outputs/qaqc-user-guide-web`.
2. Chay local preview/dev server:
   - Dung `npm run dev` hoac `npm run preview` tuy tinh trang package.
3. Mo local trong browser:
   - Kiem tra home, sidebar, mobile toc.
   - Click qua tung chuong.
4. Kiem tra anh:
   - Khong co anh broken.
   - Dashboard QAM/AM co multi-select tick ro.
   - QC/SM dashboard co data.
   - Missing score drawer co input/copy ready.
   - Audit 0 diem co minh hoa dung.
   - SM mobile doc duoc.
5. Kiem tra noi dung nghiep vu:
   - 0 diem khong tinh loi, khong tao Action Plan.
   - Bu diem chi store chua co diem, plan open, payload chi row co diem.
   - Export Excel theo filter va role scope.
   - Auto confirm sau 48h khong bi viet thanh "tu dong tao Action Plan moi truong hop".
6. Chup 2-3 screenshot guide web sau khi update:
   - Trang dashboard section.
   - Trang audit plan missing score.
   - Trang mobile SM section neu can.

## Success Criteria

- [ ] `npm run build` pass.
- [ ] Khong co broken image path.
- [ ] Noi dung moi doc lien mach, khong con chuong dashboard cu lam chinh.
- [ ] Anh moi hien dep tren desktop va mobile.
- [ ] Co ghi chu neu con anh nao can chup lai sau.

## Risk Assessment

- Risk: Anh ton tai trong public nhung duong dan JSON sai.
  Mitigation: scan path tu JSON va doi chieu file public.
- Risk: Guide build pass nhung doc xau tren mobile.
  Mitigation: mo browser mobile viewport va chinh CSS neu can.
