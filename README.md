# Maycha QA/QC + Training User Guide

Ứng dụng web độc lập để tra cứu hướng dẫn vận hành Maycha:

- Chương 1–11: QA/QC Phase 1, giữ nguyên 50 mục và 54 ảnh.
- Chương 12–20: Training Phase 2 gồm 40 mục (9 mục cha + 31 mục con) theo bằng chứng UAT ngày 21/07/2026.
- Bản web có 99 vị trí ảnh: 54 ảnh Phase 1 và 45 ảnh Phase 2, dùng đúng 45 file PNG được tham chiếu trong guide.
- Không đăng nhập, không gọi API, không kết nối cơ sở dữ liệu và không cần biến môi trường.

## Nguồn nội dung chuẩn cho bản web

`src/content/guide-content.json` là nguồn nội dung canonical cho bản web và Word. Ảnh minh họa được tham chiếu từ `public/assets/user-guide/`; bản ledger runtime đóng gói tại `src/content/phase2-evidence-ledger.json` để build độc lập trên Vercel, không phụ thuộc thư mục `plans` ngoài web package.

Ba file Word legacy được bảo toàn tại `artifacts/word-legacy/` và không được ship. Bản Word hiện hành `public/downloads/huong-dan-qaqc.docx` được sinh từ cùng `guide-content.json`, gồm đủ 90 mục và 99 vị trí ảnh, đồng bộ với bản web.

Menu Phase 2 tổ chức theo tính năng và hành trình nghiệp vụ. Riêng chương Dashboard tách thành sáu mục độc lập cho TnD Manager, Taskforce, COO, OM, AM và SM để phản ánh đúng điểm vào và phạm vi từng vai trò. Bản web và Word dùng chung nội dung canonical; nút **Tải hướng dẫn Word** luôn trỏ tới file hiện hành. Menu cha/con dùng accordion: mỗi lần chỉ mở một mục cha; nút toggle chỉ đóng/mở nhóm, hỗ trợ bàn phím và không tự điều hướng nội dung.

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

Quy trình release web + Word:

1. `npm run build:word` sinh duy nhất `public/downloads/huong-dan-qaqc.docx` từ nội dung canonical.
2. Validator kiểm tra schema, section, ảnh và DOCX hiện hành; `npm run build` tạo bản web trong `dist` cùng đúng một DOCX.
3. `npm run preview` và `npm run test:guide` kiểm tra tải Word hiện hành, chặn URL Word legacy và xác nhận menu/guide.

`npm run build:word` chỉ chạy khi nội dung canonical hoặc ảnh thay đổi; `npm run build` không tự sinh lại Word ở mọi lần build.

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
