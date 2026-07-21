# Maycha QA/QC + Training User Guide

Ứng dụng web độc lập để tra cứu hướng dẫn vận hành Maycha:

- Chương 1–11: QA/QC Phase 1, giữ nguyên 50 mục và 54 ảnh.
- Chương 12–20: Training Phase 2 gồm 40 mục (9 mục cha + 31 mục con) theo bằng chứng UAT ngày 21/07/2026.
- Bản web có 99 vị trí ảnh: 54 ảnh Phase 1 và 45 ảnh Phase 2, dùng đúng 45 file PNG được tham chiếu trong guide.
- Không đăng nhập, không gọi API, không kết nối cơ sở dữ liệu và không cần biến môi trường.

## Nguồn nội dung chuẩn cho bản web

`src/content/guide-content.json` là nguồn nội dung canonical duy nhất của **bản web** trong release này. Ảnh minh họa được tham chiếu từ `public/assets/user-guide/` và chỉ được dùng khi ledger Phase 2 đánh dấu `accepted` cùng `includeInGuide=true`.

Ba file Word legacy là bản cũ, **chưa đồng bộ Phase 2** và không được ship trong `public` hoặc `dist`. Chúng được bảo toàn ngoài vùng public tại `artifacts/word-legacy/`; schema web đã bỏ `sourceDocument` nên preview và production không công bố URL tải Word.

Menu Phase 2 tổ chức theo tính năng và hành trình nghiệp vụ. Riêng chương Dashboard tách thành sáu mục độc lập cho TnD Manager, Taskforce, COO, OM, AM và SM để phản ánh đúng điểm vào và phạm vi từng vai trò. Đây là bản phát hành **web-only**; không đồng bộ ngược sang Word. Menu cha/con dùng accordion: mỗi lần chỉ mở một mục cha; nút toggle chỉ đóng/mở nhóm, hỗ trợ bàn phím và không tự điều hướng nội dung.

## Chạy local

```bash
npm install
npm run dev
```

## Build và kiểm tra bản web

```bash
node scripts/build-guide-content.cjs
npm run build
npm run preview
```

Quy trình release hiện tại là web-only:

1. Validator đọc `guide-content.json`, kiểm tra schema, thứ tự/ID section, `imageCount` và asset.
2. `npm run build` tạo bản web trong `dist`.
3. `npm run preview` dùng để kiểm tra bản đã build.

**Không chạy `npm run build:word`, `scripts/build-word-guide.py` hoặc quy trình extract Word trong release này.** Các lệnh đó có thể tạo/phục hồi tài liệu chưa đồng bộ và không thuộc phạm vi Phase 2 web.

## Phạm vi Training Phase 2

Sáu vai trò trong scope: TnD Manager, Taskforce, COO, OM, AM và SM. Operation Head (OH) là vai trò dự phòng, ngoài phạm vi hướng dẫn.

- Dashboard: tách riêng sáu vai trò; riêng Taskforce dùng màn hình công việc đúng với giao diện UAT thay vì mô tả như một dashboard KPI.
- Các chương còn lại: nhóm theo feature/workflow, chỉ nêu khác biệt vai trò khi nghiệp vụ thực sự khác.
- AM: chỉ thực hiện khi đồng thời được TnD phân công đích danh và cửa hàng thuộc phạm vi AM quản lý; không có workaround nếu thiếu một điều kiện.
- Training tự xác nhận sau 48 giờ; QA/QC vẫn áp dụng 120 giờ.
- Phần tổng quan có bảng sáu vai trò và luồng thao tác sáu bước. Các mục 16.2, 16.4 và 16.5 dùng ảnh riêng cho từng thao tác; bộ ảnh Action Plan đã loại ảnh không còn phù hợp.

## Vercel

Deploy thư mục này như một Vercel project độc lập:

- Root directory: `outputs/qaqc-user-guide-web`.
- Framework preset: Vite.
- Build command: `npm run build`.
- Output directory: `dist`.
