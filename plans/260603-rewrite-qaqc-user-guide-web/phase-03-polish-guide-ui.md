---
phase: 3
title: Polish guide UI
status: completed
priority: P2
effort: 0.5d
dependencies:
  - 2
---

# Phase 3: Polish guide UI

## Overview

Sau khi rewrite content, tinh gon UI guide de nguoi dung doc nhanh hon va anh moi hien dep hon. Phase nay chi lam cai can thiet cho guide web, khong refactor lon.

## Requirements

- Functional: doc duoc tren desktop va mobile, menu ro, anh phong to duoc.
- Non-functional: khong doi app thanh mot landing page, uu tien tai lieu thao tac.

## Architecture

Giu Vite/React/Ant Design hien co. Neu can them presentation cho "Luu y nghiep vu", them nhe vao renderer va CSS thay vi doi schema phuc tap.

## Related Code Files

- Modify: `outputs/qaqc-user-guide-web/src/components/guide-block-renderer.tsx`
- Modify: `outputs/qaqc-user-guide-web/src/components/guide-header.tsx`
- Modify: `outputs/qaqc-user-guide-web/src/components/guide-sidebar.tsx`
- Modify: `outputs/qaqc-user-guide-web/src/styles.css`
- Modify if metadata shown: `outputs/qaqc-user-guide-web/src/App.tsx`

## Implementation Steps

1. Cap nhat header:
   - Hien "Ban cap nhat 01/06/2026".
   - Hien pham vi guide ngan gon: Dashboard, Audit Plan, Audit, Result, Action Plan.
2. Kiem tra sidebar:
   - Muc level 1/level 2 de quet nhanh.
   - Ten muc dung tieng Viet, khong bi cat qua kho hieu.
3. Cai thien block anh:
   - Caption ro: man nao, role nao, dung de lam gi.
   - Anh dashboard rong khung hop ly, khong qua be.
   - Mobile screenshot SM khong bi ep ngang xau.
4. Neu schema hien co khong du cho "luu y nghiep vu":
   - Them block `note` hoac dung class rieng cho label + bullets.
   - Chi them neu that su lam guide de doc hon.
5. Kiem tra font dau tieng Viet:
   - Khong bi loi encoding.
   - Khong co chu khong dau do noi dung cu hoac copy loi.

## Success Criteria

- [ ] Doc desktop thoang, anh nhin ro.
- [ ] Mobile guide khong vo layout.
- [ ] Cac muc "Luu y nghiep vu" noi bat vua du.
- [ ] Khong refactor UI qua lon.

## Risk Assessment

- Risk: Them component moi lam tang scope.
  Mitigation: uu tien CSS/block hien co; them block moi chi khi co loi doc that su.
