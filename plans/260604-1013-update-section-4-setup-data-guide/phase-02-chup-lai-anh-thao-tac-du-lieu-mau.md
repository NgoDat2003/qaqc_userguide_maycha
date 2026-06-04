---
phase: 2
title: Chụp lại ảnh thao tác dữ liệu mẫu
status: in-progress
priority: P1
effort: 3-4 giờ
dependencies:
  - 1
---

# Phase 2: Chụp lại ảnh thao tác dữ liệu mẫu

## Overview

Thao tác trực tiếp trên local bằng vai trò Admin, có thể lưu dữ liệu mẫu, rồi chụp lại toàn bộ ảnh cần cho mục 4.

## Requirements

- Functional: ảnh phản ánh đúng luồng tạo, sửa, lọc và kiểm tra kết quả.
- Non-functional: viewport desktop thống nhất, không che nội dung, không dùng dữ liệu kiểu `a/b/c`, không để form quan trọng trống.

## Architecture

Ảnh được chụp từ app QA/QC local và lưu tại `public/assets/user-guide/2026-06-setup-guide/`. Tên file đánh số theo đúng thứ tự xuất hiện trong guide để dễ thay thế và kiểm tra.

## Related Code Files

- Modify: `public/assets/user-guide/2026-06-setup-guide/*.png`
- Read: app QA/QC `apps/web/app/(app)/master-data/**`

## Implementation Steps

1. Bật Docker, API và web; xác nhận API health và đăng nhập Admin.
2. Chuẩn bị dữ liệu mẫu nhất quán; chỉ tạo thêm khi dữ liệu local chưa đủ.
3. Chụp 4.1 Thương hiệu:
   - Danh sách có brand vừa tạo.
   - Drawer tạo/chỉnh sửa đã nhập đầy đủ.
   - Trạng thái hoặc logo nếu có dữ liệu phù hợp.
4. Chụp 4.3 Địa bàn trước cửa hàng:
   - Danh sách tỉnh/thành.
   - Form tỉnh/thành đã nhập.
   - Danh sách xã/phường của đúng tỉnh/thành.
   - Form xã/phường đã nhập đầy đủ.
5. Chụp 4.2 Cửa hàng:
   - Danh sách và bộ lọc có ý nghĩa.
   - Form đầy đủ từ mã/tên, tài khoản SM đến brand, AM, loại cửa hàng, địa bàn và địa chỉ.
   - Kết quả sau lưu, thể hiện cửa hàng và tài khoản SM được tạo đúng.
6. Chụp 4.4 Người dùng:
   - Danh sách và filter role/trạng thái.
   - Form đã nhập thông tin cơ bản.
   - Phần bộ phận, nhiều role và phạm vi quyền.
   - Modal reset mật khẩu có mật khẩu mẫu hợp lệ.
7. Kiểm tra từng ảnh: dữ liệu đúng, không mâu thuẫn, không có thông báo lỗi, không lộ mật khẩu rõ.
8. Xóa hoặc ngừng tham chiếu ảnh cũ không đạt.

## Success Criteria

- [ ] Mỗi nhóm dữ liệu có ảnh danh sách, form và kết quả phù hợp.
- [ ] Không còn ảnh form xã/phường, người dùng hoặc reset mật khẩu bị trống.
- [ ] Cửa hàng mẫu có địa chỉ khớp tỉnh/thành và xã/phường.
- [ ] Ảnh người dùng minh họa rõ bộ phận, role và phạm vi quyền.
- [x] Tất cả ảnh đang được tham chiếu có kích thước và chất lượng đọc tốt trên guide.

## Execution Status

- Đã rà soát toàn bộ ảnh mục 4 hiện có.
- Đã ngừng tham chiếu ảnh `06-store-create-drawer-complete.png` vì địa bàn Cần Thơ không khớp địa chỉ TP.HCM.
- Chưa thể chụp lại ảnh form đầy đủ vì trình điều khiển browser bị chính sách bảo mật chặn truy cập tab local.
- Giữ phase ở trạng thái `in-progress`; cần chụp lại form xã/phường, người dùng, phân quyền và kết quả sau lưu khi browser local hoạt động.

## Risk Assessment

- Lưu nhầm dữ liệu mẫu vào môi trường không phải local: xác nhận URL và môi trường trước mọi thao tác lưu.
- Mật khẩu xuất hiện trong ảnh: dùng trường password che ký tự và không chụp khi bật hiển thị.
- Dropdown dài làm ảnh khó hiểu: mở đúng option cần minh họa, không chụp menu gây che nội dung chính.
