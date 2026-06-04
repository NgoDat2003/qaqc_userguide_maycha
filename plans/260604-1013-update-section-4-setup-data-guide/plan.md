---
title: Cập nhật mục 4 - Thiết lập dữ liệu nền
description: >-
  Viết lại mục 4 theo luồng thao tác thực tế, chụp lại ảnh với dữ liệu mẫu nhất
  quán và bổ sung hướng dẫn kiểm tra kết quả sau khi lưu.
status: in-progress
priority: P2
branch: main
tags:
  - user-guide
  - setup-data
  - screenshots
blockedBy: []
blocks: []
created: '2026-06-04T03:13:48.837Z'
createdBy: 'ck:plan'
source: skill
---

# Cập nhật mục 4 - Thiết lập dữ liệu nền

## Overview

Mục 4 hiện có đúng bốn nhóm dữ liệu nền nhưng chưa đủ chi tiết để Admin mới có thể tự thao tác hoàn chỉnh. Một số ảnh form còn trống, ảnh cửa hàng có địa bàn không khớp địa chỉ, và nội dung chưa minh họa rõ mối liên hệ giữa thương hiệu, địa bàn, cửa hàng, tài khoản SM và phân quyền người dùng.

Đợt cập nhật này chỉ thay đổi website user guide độc lập trong `outputs/qaqc-user-guide-web`. Không sửa chức năng app QA/QC, không cập nhật Word và không đưa thay đổi vào repo Maycha QAQC chính.

Thứ tự hướng dẫn nghiệp vụ:

1. Tạo hoặc kiểm tra thương hiệu.
2. Tạo tỉnh/thành và xã/phường.
3. Tạo cửa hàng, gắn thương hiệu, AM, địa bàn và tạo tài khoản SM.
4. Tạo người dùng nội bộ, gán bộ phận, vai trò và phạm vi quyền.
5. Kiểm tra dữ liệu vừa lưu xuất hiện đúng trong danh sách và các dropdown liên quan.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Khảo sát và chốt kịch bản ảnh](./phase-01-khao-sat-va-chot-kich-ban-anh.md) | Completed |
| 2 | [Chụp lại ảnh thao tác dữ liệu mẫu](./phase-02-chup-lai-anh-thao-tac-du-lieu-mau.md) | In Progress |
| 3 | [Viết lại nội dung mục 4](./phase-03-viet-lai-noi-dung-muc-4.md) | Completed |
| 4 | [Kiểm thử và nghiệm thu guide](./phase-04-kiem-thu-va-nghiem-thu-guide.md) | In Progress |

## Dependencies

- App QA/QC local hoạt động tại `http://localhost:3000`, API và MongoDB sẵn sàng.
- Tài khoản Admin có quyền quản lý thương hiệu, cửa hàng, địa bàn và người dùng.
- Nguồn nội dung: `scripts/build-guide-content.cjs`.
- Ảnh mục 4: `public/assets/user-guide/2026-06-setup-guide/`.
- Plan viết lại toàn guide trước đó đã hoàn thành; plan này là đợt nâng chất lượng riêng cho mục 4.

## Definition Of Done

- Nội dung 4.1 đến 4.4 đủ để Admin mới làm theo mà không cần hỏi thêm.
- Ảnh không còn dữ liệu trống, dữ liệu giả sơ sài hoặc thông tin mâu thuẫn.
- Có ảnh trước thao tác, form đã nhập và kết quả sau khi lưu cho mỗi nhóm dữ liệu chính.
- Giải thích rõ tài khoản SM được tạo từ cửa hàng và người dùng nội bộ được tạo từ màn Người dùng.
- Mọi ảnh được tham chiếu đều tồn tại; guide build thành công và kiểm tra được trên desktop/mobile.
