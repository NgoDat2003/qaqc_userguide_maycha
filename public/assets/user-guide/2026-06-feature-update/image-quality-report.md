# Đánh giá chất lượng ảnh user guide

Ngày chụp/đánh giá: 03/06/2026.

## Đạt để đưa vào guide

- `dashboard-qam-verified-overview.png`
- `dashboard-qam-multi-selected-dropdown-data.png`
- `dashboard-qam-multi-selected-overview-data.png`
- `dashboard-am-verified-overview.png`
- `dashboard-am-multi-selected-dropdown-data.png`
- `dashboard-am-multi-selected-overview-data.png`
- `dashboard-qc-verified-overview.png`
- `dashboard-sm-verified-overview.png`
- `audit-results-list-export-excel-verified.png`
- `audit-result-detail-findings-and-zero-note.png`
- `audit-plans-list-verified.png`
- `audit-plan-detail-overview.png`
- `audit-plan-missing-scores-drawer.png`
- `audit-plan-missing-scores-copy-ready.png`
- `audit-execution-list-verified.png`
- `audit-execution-in-progress-detail.png`
- `audit-execution-criterion-modal.png`
- `audit-execution-violation-mode.png`
- `notifications-score-confirmation-verified.png`
- `sm-mobile-dashboard-top-with-action-plan.png`
- `sm-mobile-dashboard-action-plan-section-with-data.png`
- `sm-mobile-action-plans-with-data.png`
- `sm-mobile-action-plans-list-card.png`
- `sm-mobile-notifications-with-action-plan.png`

## Không nên dùng

- `debug-*.png`: ảnh debug login/route.
- `dashboard-qam-clean-overview.png`: login fail, chỉ là màn đăng nhập.
- `dashboard-qam-filter-dropdown-primary.png`: chọn Cloud làm dashboard rỗng.
- `dashboard-am-filter-dropdown-primary.png`: chỉ có một brand được chọn.
- `dashboard-*-multi-select-dropdown.png`: ảnh cũ, nhiều file thực chất là cùng màn QAM.
- `sm-mobile-action-plans.png`: trước khi bổ sung data, Action Plan trống.
- `sm-mobile-dashboard-top.png`: dùng bản `with-action-plan` mới hơn.

## Cần lưu ý khi viết guide

- Multi-select đẹp nhất dùng ảnh QAM hoặc AM vì có 2 brand được tick và dashboard vẫn có data.
- QC overview đẹp, có dữ liệu thật. Ảnh dropdown QC không nên dùng để chứng minh multi-select vì automation chưa tick option ổn định.
- SM mobile đã được bổ sung data local bằng flow nghiệp vụ: xác nhận điểm bài `mc-015` có lỗi rồi tạo Action Plan từ session.
- Zero-point hiện chưa có nút/label riêng trong UI; ảnh `audit-execution-violation-mode.png` thể hiện case số lỗi ghi nhận = 0, điểm vẫn không đổi và cần ghi chú.

## Data đã bổ sung local

- Session `6a1fd74b545f8e4896786e19` của store `mc-015` được SM xác nhận điểm.
- Action Plan draft `6a1ff2d5d3673cf978dfb913` được tạo từ session trên.

## Câu hỏi mở

- Có cần seed thêm dữ liệu cho `Cloud` và `Trà Hú` để ảnh dropdown 4 brand khi chọn nhiều brand luôn có data đầy đủ không?
