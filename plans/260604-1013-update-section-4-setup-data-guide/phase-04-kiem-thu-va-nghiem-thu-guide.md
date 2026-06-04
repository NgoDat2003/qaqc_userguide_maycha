---
phase: 4
title: Kiểm thử và nghiệm thu guide
status: in-progress
priority: P1
effort: 1-2 giờ
dependencies:
  - 3
---

# Phase 4: Kiểm thử và nghiệm thu guide

## Overview

Kiểm tra nội dung, ảnh, khả năng đọc và build của website user guide trước khi chốt mục 4.

## Requirements

- Functional: tất cả link ảnh hợp lệ, trình tự hướng dẫn đúng và nội dung khớp app.
- Non-functional: hiển thị tốt trên desktop/mobile, không có ảnh quá nhỏ hoặc caption sai.

## Related Code Files

- Verify: `scripts/build-guide-content.cjs`
- Verify: `src/content/guide-content.json`
- Verify: `public/assets/user-guide/2026-06-setup-guide/*`
- Verify: `src/styles.css`

## Implementation Steps

1. Chạy script sinh nội dung và kiểm tra số section/số ảnh.
2. Kiểm tra tự động mọi đường dẫn ảnh trong JSON đều tồn tại.
3. Chạy typecheck và production build của user guide.
4. Mở guide local, duyệt mục 4 theo thứ tự 4.1 đến 4.4 trên desktop.
5. Kiểm tra mobile: sidebar/TOC, ảnh phóng to, bảng và nội dung không tràn.
6. Đóng vai Admin mới, đọc guide và thực hiện lại một luồng hoàn chỉnh:
   - Tạo địa bàn hoặc dùng địa bàn có sẵn.
   - Tạo cửa hàng gắn đúng brand/AM/địa bàn.
   - Kiểm tra tài khoản SM.
   - Tạo người dùng nội bộ và gán quyền.
7. Soát lần cuối dữ liệu mẫu, caption, chính tả và thuật ngữ.

## Success Criteria

- [x] Script sinh nội dung chạy thành công.
- [x] Không có đường dẫn ảnh thiếu.
- [x] `npm run build` thành công.
- [ ] Mục 4 hiển thị tốt trên desktop và mobile.
- [ ] Một người dùng mới có thể làm theo guide để hoàn thành luồng thiết lập.
- [x] Không còn ảnh có dữ liệu mẫu mâu thuẫn được tham chiếu trong mục 4.

## Execution Status

- Đã xác nhận 43 section, 69 ảnh, không có section rỗng, ID trùng hoặc tiêu đề trùng.
- Đã xác nhận thứ tự mục 4 là Thương hiệu → Địa bàn → Cửa hàng → Người dùng và phân quyền.
- Đã chạy lại production build thành công sau khi sinh JSON.
- Chưa thể nghiệm thu trực quan desktop/mobile hoặc đóng vai Admin do browser local bị chính sách bảo mật chặn.

## Risk Assessment

- Ảnh mới làm guide dài: giữ mỗi ảnh có mục đích riêng, không lặp cùng trạng thái.
- Nội dung app thay đổi sau khi chụp: ghi nhận ngày chụp và chụp lại khi UI/flow thay đổi.
