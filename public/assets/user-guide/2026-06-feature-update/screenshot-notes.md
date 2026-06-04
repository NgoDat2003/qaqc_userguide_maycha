# Bộ ảnh cập nhật tính năng 01/06/2026

Nguồn chụp: app local `http://localhost:3000`, API local `http://localhost:3001`.

## Dashboard 5 role

- `dashboard-qam-verified-overview.png`: Dashboard QAM, filter Brand/AM/Loại cửa hàng/Cửa hàng/Checklist.
- `dashboard-qam-multi-selected-dropdown-data.png`: Brand multi-select có checkbox/tick, chọn Maycha + Tam Hảo và vẫn có dữ liệu.
- `dashboard-qam-multi-selected-overview-data.png`: Dashboard QAM sau khi lọc 2 brand, không bị rỗng data.
- `dashboard-qam-filter-dropdown-primary.png`: Không ưu tiên dùng vì ảnh chọn Cloud làm dashboard rỗng.
- `dashboard-qam-filter-dropdown-store-type.png`: Loại cửa hàng.
- `dashboard-qc-verified-overview.png`: Dashboard QC.
- `dashboard-qc-filter-dropdown-primary.png`: Filter chính của QC ở trạng thái mở, chỉ dùng nếu cần minh họa option list.
- `dashboard-qc-multi-selected-dropdown-data.png`: Không ưu tiên dùng, automation chưa chọn được option dù dropdown mở.
- `dashboard-am-verified-overview.png`: Dashboard AM.
- `dashboard-am-multi-selected-dropdown-data.png`: Brand multi-select AM, chọn Maycha + Tam Hảo và dashboard còn dữ liệu.
- `dashboard-am-multi-selected-overview-data.png`: Dashboard AM sau khi lọc 2 brand.
- `dashboard-am-filter-dropdown-primary.png`: Không ưu tiên dùng vì chỉ chọn 1 brand.
- `dashboard-am-filter-dropdown-store-type.png`: Loại cửa hàng của AM.
- `dashboard-sm-verified-overview.png`: Dashboard SM.
- `dashboard-sm-filter-dropdown-primary.png`: Filter chính của SM.

## Kết quả audit

- `audit-results-list-export-excel-verified.png`: Màn Kết quả audit có filter và nút Xuất Excel.
- `audit-result-detail-findings-and-zero-note.png`: Detail kết quả audit, dùng để mô tả breakdown lỗi/ghi nhận.

## Kế hoạch audit / bù điểm

- `audit-plans-list-verified.png`: Danh sách kế hoạch audit.
- `audit-plan-detail-overview.png`: Detail audit plan, nút Cửa hàng chưa có điểm.
- `audit-plan-missing-scores-drawer.png`: Drawer danh sách cửa hàng chưa có điểm, có điểm gần nhất để tham khảo.
- `audit-plan-missing-scores-copy-ready.png`: Sau khi sao chép điểm trống, chỉ dòng có điểm được chuẩn bị cập nhật.

## Thực hiện audit

- `audit-execution-list-verified.png`: Danh sách audit được giao cho QC.
- `audit-execution-in-progress-detail.png`: Bài audit đang thực hiện.
- `audit-execution-criterion-modal.png`: Popup đánh giá tiêu chí ở trạng thái Pass.
- `audit-execution-violation-mode.png`: Mode lỗi trừ điểm với số lỗi ghi nhận = 0, điểm vẫn Pass mặc định và yêu cầu ghi chú.

## Notification

- `notifications-score-confirmation-verified.png`: Popover thông báo liên quan xác nhận điểm/quy trình.

## Mobile SM

- `sm-mobile-dashboard-top-with-action-plan.png`: Dashboard SM mobile, phần filter + KPI đầu.
- `sm-mobile-dashboard-action-plan-section-with-data.png`: Dashboard SM mobile sau khi có Action Plan.
- `sm-mobile-action-plans-with-data.png`: Action Plan mobile có số liệu KPI.
- `sm-mobile-action-plans-list-card.png`: Action Plan mobile có card kế hoạch thật.
- `sm-mobile-notifications-with-action-plan.png`: Notification mobile sau khi tạo Action Plan.

## Ghi chú còn lại

- UI hiện tại không có label riêng "Không bị trừ điểm"; luồng 0 điểm đang thể hiện bằng mode lỗi với số lỗi = 0, ghi chú bắt buộc, điểm không đổi.
- Có bổ sung data local đúng nghiệp vụ cho SM: xác nhận điểm một bài `mc-015` có lỗi và tạo Action Plan từ session đó để chụp mobile không bị trắng.
- Không bấm bulk update điểm bù thật trong lúc chụp để tránh làm thay đổi nhiều dữ liệu seed.
