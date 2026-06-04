---
phase: 3
title: Viết lại nội dung mục 4
status: completed
priority: P1
effort: 2-3 giờ
dependencies:
  - 1
---

# Phase 3: Viết lại nội dung mục 4

## Overview

Viết lại nội dung mục 4 theo hướng người dùng mới có thể làm theo từng bước, hiểu dữ liệu nào ảnh hưởng tới chức năng nào và biết cách kiểm tra sau khi lưu.

## Requirements

- Functional: mỗi tiểu mục có mục đích, quyền cần có, điều kiện trước khi thao tác, các bước, giải thích trường dữ liệu, kết quả mong đợi và lưu ý.
- Non-functional: tiếng Việt rõ ràng, nhất quán tên gọi trên UI, không mô tả API hoặc chi tiết kỹ thuật không cần thiết cho người dùng.

## Architecture

Nội dung nguồn tiếp tục quản lý trong `scripts/build-guide-content.cjs`, sau đó sinh lại `src/content/guide-content.json`. Không chỉnh JSON thủ công.

## Related Code Files

- Modify: `scripts/build-guide-content.cjs`
- Generate: `src/content/guide-content.json`
- Read: `src/components/guide-block-renderer.tsx`

## Implementation Steps

1. Viết lại phần mở đầu mục 4:
   - Ai nên thực hiện.
   - Thứ tự thiết lập khuyến nghị.
   - Dữ liệu nền ảnh hưởng dashboard, filter, audit plan và phân quyền ra sao.
2. Viết 4.1 Thương hiệu:
   - Tạo/chỉnh sửa brand, logo, mã không nên đổi, trạng thái.
   - Cách kiểm tra brand xuất hiện trong danh sách và dropdown.
3. Viết 4.2 Cửa hàng:
   - Điều kiện phải có brand, AM và địa bàn trước.
   - Giải thích đầy đủ từng trường và quan hệ phụ thuộc tỉnh/thành → xã/phường.
   - Nêu rõ tài khoản SM được tạo cùng cửa hàng và trạng thái tài khoản đi theo cửa hàng.
   - Hướng dẫn tìm/filter và kiểm tra cửa hàng sau lưu.
4. Viết 4.3 Địa bàn:
   - Tách rõ thao tác tỉnh/thành và xã/phường.
   - Nêu rõ không đổi mã khi đã có cửa hàng sử dụng.
   - Hướng dẫn xử lý khi dropdown xã/phường không có dữ liệu.
5. Viết 4.4 Người dùng và phân quyền:
   - Phân biệt tài khoản nội bộ và tài khoản SM.
   - Giải thích bộ phận, nhiều role, phạm vi quyền và quyền được gộp.
   - Hướng dẫn khóa/mở khóa và reset mật khẩu.
6. Đặt ảnh ngay sau bước mà ảnh minh họa; caption ngắn gọn và đúng nội dung.
7. Sinh lại JSON bằng script.

## Success Criteria

- [ ] Nội dung 4.1-4.4 cùng một cấu trúc và thuật ngữ.
- [ ] Người dùng hiểu thứ tự thiết lập dữ liệu nền.
- [ ] Giải thích rõ sự khác nhau giữa tài khoản SM và người dùng nội bộ.
- [ ] Mỗi ảnh nằm đúng bước thao tác, caption không chung chung.
- [ ] JSON được sinh lại từ script, không chỉnh thủ công.

## Risk Assessment

- Nội dung quá dài: ưu tiên bước thao tác và lưu ý nghiệp vụ; dùng bullet/table để dễ quét.
- Mô tả lệch UI: đối chiếu lại app local trước khi chốt từng tên trường/nút.
