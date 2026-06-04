# Full image audit report

Phạm vi đã đánh giá:

- 57 ảnh cũ đang được guide dùng: `figure-001.png` đến `figure-057.png`.
- Bộ ảnh mới trong `2026-06-feature-update`.
- Contact sheet để đối chiếu nhanh:
  - `../audit-contact-sheets/old-guide-contact-sheet-01.png`
  - `../audit-contact-sheets/old-guide-contact-sheet-02.png`
  - `../audit-contact-sheets/old-guide-contact-sheet-03.png`
  - `../audit-contact-sheets/old-guide-contact-sheet-04.png`
  - `../audit-contact-sheets/old-guide-contact-sheet-05.png`

## Kết luận ngắn

Chưa thể nói bộ ảnh cũ đều ổn. Ảnh cũ có nhiều màn vẫn dùng được cho phần nền/quản trị, nhưng các phần nghiệp vụ đã đổi trong đợt dashboard/export/bù điểm/zero-point/48h thì nên thay hoặc bổ sung bằng ảnh mới.

## Nhóm nên thay bằng ảnh mới

### Dashboard

- `figure-004.png` Dashboard QAM: lỗi thời so với dashboard mới, thiếu filter multi-select, Brand/AM/Cửa hàng/Checklist, layout hiện tại đã khác.
- `figure-005.png` Dashboard QC: lỗi thời so với dashboard QC mới, thiếu filter Brand/Trạng thái/Cửa hàng dạng mới.
- `figure-006.png` Dashboard SM: lỗi thời, thiếu mobile SM mới và Action Plan data mới.

Ảnh thay thế:

- `dashboard-qam-verified-overview.png`
- `dashboard-qam-multi-selected-dropdown-data.png`
- `dashboard-qam-multi-selected-overview-data.png`
- `dashboard-qc-verified-overview.png`
- `dashboard-am-verified-overview.png`
- `dashboard-am-multi-selected-dropdown-data.png`
- `dashboard-am-multi-selected-overview-data.png`
- `dashboard-sm-verified-overview.png`
- `sm-mobile-dashboard-top-with-action-plan.png`
- `sm-mobile-dashboard-action-plan-section-with-data.png`

### Kết quả audit

- `figure-019.png`: danh sách kết quả cũ, thiếu nút Export Excel/filter mới.
- `figure-020.png`: chi tiết kết quả cũ, chưa thể hiện rõ update zero-point/report mới.
- `figure-021.png`, `figure-022.png`: chỉnh sửa kết quả cũ có thể giữ nếu guide còn phần edit, nhưng nên bổ sung ảnh mới cho export/filter.

Ảnh thay thế/bổ sung:

- `audit-results-list-export-excel-verified.png`
- `audit-result-detail-findings-and-zero-note.png`

### Action Plan

- `figure-023.png`: xác nhận điểm cũ còn hữu ích nhưng thiếu context auto-confirm 48h/Action Plan sau xác nhận mới.
- `figure-024.png` đến `figure-029.png`: Action Plan cũ nhìn được, nhưng data mỏng và chưa thể hiện rõ mobile SM sau khi có AP thật.

Ảnh thay thế/bổ sung:

- `notifications-score-confirmation-verified.png`
- `sm-mobile-action-plans-with-data.png`
- `sm-mobile-action-plans-list-card.png`
- `sm-mobile-notifications-with-action-plan.png`

### Kế hoạch audit / bù điểm

- `figure-030.png`, `figure-031.png`: danh sách/detail kế hoạch cũ thiếu nút `Cửa hàng chưa có điểm`.
- `figure-032.png` đến `figure-036.png`: tạo/phát hành kế hoạch cũ vẫn dùng được nếu guide còn phần tạo plan, nhưng cần bổ sung flow bù điểm.

Ảnh thay thế/bổ sung:

- `audit-plans-list-verified.png`
- `audit-plan-detail-overview.png`
- `audit-plan-missing-scores-drawer.png`
- `audit-plan-missing-scores-copy-ready.png`

## Nhóm có thể giữ

### Login / tài khoản

- `figure-001.png`: login còn ổn.
- `figure-002.png`: menu tài khoản còn ổn nếu UI account menu chưa đổi.
- `figure-003.png`: đổi mật khẩu còn ổn.

### Thực hiện audit mobile cũ

- `figure-007.png` đến `figure-012.png`: vẫn minh họa được flow audit mobile cơ bản.
- `figure-013.png` đến `figure-016.png`: Risk/CCP group cũ vẫn hữu ích.
- `figure-017.png`, `figure-018.png`: QC xem lại kết quả cũ còn tạm dùng được.

Bổ sung ảnh mới nên dùng:

- `audit-execution-list-verified.png`
- `audit-execution-in-progress-detail.png`
- `audit-execution-criterion-modal.png`
- `audit-execution-violation-mode.png`

Ghi chú: zero-point hiện chưa có label riêng trong UI; ảnh `audit-execution-violation-mode.png` chỉ thể hiện case số lỗi = 0, ghi chú bắt buộc, điểm không đổi.

### Tiêu chí / checklist

- `figure-037.png` đến `figure-048.png`: nhìn ổn, ít liên quan thay đổi mới, có thể giữ.

### Master data / quản trị

- `figure-050.png` đến `figure-057.png`: nhìn ổn, có thể giữ.

### Notification

- `figure-049.png`: popup thông báo cũ có thể giữ như ví dụ chung, nhưng nên bổ sung ảnh notification mới cho score/action-plan.

## Ảnh mới không nên dùng

- `debug-*.png`: chỉ dùng debug.
- `dashboard-qam-clean-overview.png`: login fail.
- `dashboard-qam-filter-dropdown-primary.png`: chọn Cloud làm dashboard rỗng.
- `dashboard-am-filter-dropdown-primary.png`: chỉ chọn 1 brand.
- `dashboard-*-multi-select-dropdown.png`: ảnh cũ/tạm, nhiều file trùng màn QAM.
- `sm-mobile-action-plans.png`: trước khi bổ sung data nên Action Plan trống.
- `dashboard-qc-multi-selected-dropdown-data.png`: automation chưa tick option ổn định, không dùng để minh họa multi-select.

## Đánh giá theo tiêu chí "đẹp và đúng data"

- Đẹp + đúng: QAM/AM multi-select mới, audit plan missing score, mobile SM action plan sau khi bổ sung data.
- Đúng nhưng chưa đẹp/không nên ưu tiên: QC dropdown multi-select vì không tick option rõ trong ảnh.
- Đẹp nhưng lỗi thời: dashboard cũ `figure-004..006`.
- Đúng nền nhưng thiếu feature mới: action plan cũ `figure-024..029`, audit plan cũ `figure-030..036`.

## Data local đã bổ sung để chụp đẹp hơn

- Xác nhận điểm session `6a1fd74b545f8e4896786e19` của store `mc-015`.
- Tạo Action Plan draft `6a1ff2d5d3673cf978dfb913`.

## Câu hỏi mở

- Có cần seed thêm dữ liệu cho `Cloud` và `Trà Hú` để ảnh chọn multi-brand gồm 4 brand vẫn có dashboard data, thay vì chỉ dùng Maycha + Tam Hảo?
