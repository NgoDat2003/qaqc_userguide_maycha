---
phase: 1
title: Khảo sát và chốt kịch bản ảnh
status: completed
priority: P1
effort: 1-2 giờ
dependencies: []
---

# Phase 1: Khảo sát và chốt kịch bản ảnh

## Overview

Đối chiếu guide hiện tại với giao diện thật để xác định nội dung thiếu, ảnh cần giữ và ảnh phải chụp lại.

## Key Insights

- Mục 4 hiện có 12 ảnh nhưng chủ yếu dừng ở danh sách và form.
- Ảnh cửa hàng hoàn chỉnh đang chọn Thành phố Cần Thơ/An Bình nhưng địa chỉ ghi Quận 1, TP.HCM.
- Form tạo xã/phường, tạo người dùng và reset mật khẩu chưa có dữ liệu hoàn chỉnh.
- Chưa có ảnh thể hiện kết quả sau khi lưu và chưa minh họa rõ phân quyền nhiều vai trò/phạm vi.
- Luồng chuẩn phải phân biệt tài khoản SM tạo từ Cửa hàng với tài khoản nhân sự tạo từ Người dùng.

## Requirements

- Functional: lập ma trận nội dung và ảnh cho 4.1 Thương hiệu, 4.2 Cửa hàng, 4.3 Địa bàn, 4.4 Người dùng và phân quyền.
- Non-functional: ảnh dùng cùng một bộ dữ liệu mẫu, chữ dễ đọc, không lộ dữ liệu nhạy cảm.

## Related Code Files

- Read: `scripts/build-guide-content.cjs`
- Read: `src/content/guide-content.json`
- Read: `public/assets/user-guide/2026-06-setup-guide/*`
- Read: app QA/QC `apps/web/app/(app)/master-data/**`

## Implementation Steps

1. Mở từng màn Admin: Thương hiệu, Cửa hàng, Địa bàn, Người dùng.
2. Ghi nhận đầy đủ filter, cột danh sách, drawer/modal, validation và trạng thái sau lưu.
3. Chốt bộ dữ liệu mẫu dùng xuyên suốt:
   - Thương hiệu: `Maycha`.
   - Địa bàn: `Thành phố Hồ Chí Minh` / `Phường Bến Thành`.
   - Cửa hàng: `MC-GUIDE-01` / `Maycha Bến Thành`.
   - AM: tài khoản AM có thật trong local.
   - SM: `sm.mc-guide01@maycha.vn`.
   - Người dùng nội bộ: tên, email và số điện thoại hợp lệ, gắn role phù hợp.
4. Chốt ma trận ảnh tối thiểu:
   - Thương hiệu: danh sách, form đã nhập, kết quả sau lưu/chỉnh sửa.
   - Địa bàn: danh sách tỉnh, form tỉnh, danh sách phường, form phường đã nhập.
   - Cửa hàng: danh sách/filter, form thông tin cơ bản, form quan hệ đầy đủ, kết quả sau lưu.
   - Người dùng: danh sách/filter, form thông tin, phân quyền nhiều vai trò/phạm vi, reset mật khẩu.
5. Đánh dấu ảnh cũ cần thay và tên file mới dự kiến.

## Success Criteria

- [ ] Có ma trận ảnh rõ cho từng tiểu mục.
- [ ] Bộ dữ liệu mẫu không mâu thuẫn giữa địa chỉ, tỉnh/thành và xã/phường.
- [ ] Xác định rõ ảnh nào giữ, ảnh nào chụp lại.
- [ ] Nội dung được kiểm chứng từ giao diện thật, không suy đoán.

## Risk Assessment

- Dữ liệu local thiếu AM/địa bàn phù hợp: bổ sung dữ liệu local có ý nghĩa trước khi chụp.
- Thao tác lưu tạo dữ liệu trùng: dùng mã/email riêng cho guide và kiểm tra trước khi lưu.
