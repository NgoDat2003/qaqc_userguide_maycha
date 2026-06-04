---
phase: 1
title: Map content and assets
status: completed
priority: P1
effort: 0.5d
dependencies: []
---

# Phase 1: Map content and assets

## Overview

Chot lai khung noi dung ban moi va map anh minh hoa truoc khi sua content. Muc tieu la tranh lay nham anh cu, anh dashboard rong data, hoac anh dropdown khong the hien duoc multi-select.

## Requirements

- Functional: xac dinh day du cac chuong user guide moi, moi chuong co danh sach anh can dung.
- Non-functional: chi dung anh co data dep, ro nghiep vu, khong trung lap vo ich.

## Architecture

Website guide dang doc noi dung tu `guide-content.json`, moi block anh can dung duong dan public dang bat dau bang `/assets/user-guide/...`. Phase nay khong can doi renderer, chi can tao map noi dung -> anh.

## Related Code Files

- Read: `outputs/qaqc-user-guide-web/src/content/guide-content.json`
- Read: `outputs/qaqc-user-guide-web/public/assets/user-guide/2026-06-feature-update/full-image-audit-report.md`
- Read: `outputs/qaqc-user-guide-web/public/assets/user-guide/2026-06-feature-update/image-quality-report.md`
- Modify later: `outputs/qaqc-user-guide-web/src/content/guide-content.json`

## Implementation Steps

1. Lap danh sach chuong moi:
   - Tong quan he thong va vai tro.
   - Dang nhap, doi mat khau, chon vai tro.
   - Dashboard 5 role: Admin/QAM, AM, QC, SM.
   - Ke hoach audit va bu diem store chua cham.
   - QC thuc hien audit, bao gom ghi nhan 0 diem.
   - Ket qua audit va xuat Excel.
   - Xac nhan diem, auto confirm 48h, Action Plan.
   - Thong bao.
   - Quan tri du lieu nen.
   - FAQ.
2. Map anh moi bat buoc:
   - QAM: `dashboard-qam-verified-overview.png`, `dashboard-qam-multi-selected-dropdown-data.png`, `dashboard-qam-multi-selected-overview-data.png`.
   - AM: `dashboard-am-verified-overview.png`, `dashboard-am-multi-selected-dropdown-data.png`, `dashboard-am-multi-selected-overview-data.png`.
   - QC: `dashboard-qc-verified-overview.png`.
   - SM: `dashboard-sm-verified-overview.png`, `sm-mobile-dashboard-top-with-action-plan.png`, `sm-mobile-dashboard-action-plan-section-with-data.png`.
   - Audit plan: `audit-plans-list-verified.png`, `audit-plan-detail-overview.png`, `audit-plan-missing-scores-drawer.png`, `audit-plan-missing-scores-copy-ready.png`.
   - Audit execution: `audit-execution-list-verified.png`, `audit-execution-in-progress-detail.png`, `audit-execution-criterion-modal.png`, `audit-execution-violation-mode.png`.
   - Result/export: `audit-results-list-export-excel-verified.png`, `audit-result-detail-findings-and-zero-note.png`.
   - Notification/SM mobile: `notifications-score-confirmation-verified.png`, `sm-mobile-action-plans-with-data.png`, `sm-mobile-notifications-with-action-plan.png`.
3. Danh dau anh khong nen dung:
   - Anh dashboard filter Cloud hoac dashboard rong data.
   - Anh multi-select bi automation khong tick duoc.
   - Anh debug login/dashboard.
4. Chot anh cu duoc phep giu:
   - Login/doi mat khau neu UI chua doi.
   - Tieu chi, checklist, master data neu van dung.
   - Mot so anh tao/publish audit plan neu UI chua doi.
5. Tao ghi chu mapping ngan trong plan hoac trong comment noi dung neu can, de phase rewrite khong chon sai asset.

## Success Criteria

- [ ] Co map chuong -> anh ro rang.
- [ ] Khong dung anh dashboard rong data lam anh chinh.
- [ ] Anh new feature 01/06/2026 da duoc gan vao dung chuong.
- [ ] Xac dinh ro anh cu nao giu, anh cu nao thay.

## Risk Assessment

- Risk: Anh cu trong Word guide lam nguoi dung hieu sai UI hien tai.
  Mitigation: dashboard/result/plan/action flow uu tien anh moi.
- Risk: Anh multi-select khong ro la chon nhieu.
  Mitigation: dung anh co checkbox/tick va overview sau khi chon nhieu.
