# Maycha QA/QC + Training User Guide

Ứng dụng web độc lập để tra cứu hướng dẫn vận hành Maycha:

- Chương 1–11: QA/QC Phase 1, giữ nguyên 50 mục và 54 ảnh.
- Chương 12–20: Training Phase 2 gồm 37 mục (9 mục cha + 28 mục con) theo bằng chứng UAT ngày 21/07/2026.
- Toàn bộ guide có 87 mục và 90 vị trí ảnh: 54 ảnh Phase 1 và 36 ảnh Phase 2, dùng đúng 36 file PNG Phase 2 được tham chiếu trong guide.
- Không đăng nhập, không gọi API, không kết nối cơ sở dữ liệu và không cần biến môi trường.

## Nguồn nội dung chuẩn cho bản web

`src/content/guide-content.json` là nguồn nội dung canonical cho bản web và Word. Ảnh minh họa được tham chiếu từ `public/assets/user-guide/`; bản ledger runtime đóng gói tại `src/content/phase2-evidence-ledger.json` để build độc lập trên Vercel, không phụ thuộc thư mục `plans` ngoài web package.

Ba file Word legacy được bảo toàn tại `artifacts/word-legacy/` và không được ship. File `public/downloads/huong-dan-qaqc.docx` hiện chỉ là bản đã tạo trước đợt viết lại Phase 2; giao diện không cho tải và hiển thị **Bản Word đang cập nhật** cho đến khi nội dung web được duyệt rồi đồng bộ lại.

Menu Phase 2 tổ chức theo tính năng và hành trình nghiệp vụ. Chương Dashboard có bốn mục: Dashboard cấp quản lý gộp TnD Manager, COO và OM; ba mục còn lại dành cho Taskforce, AM và SM. Mục cấp quản lý dùng một ảnh Dashboard TnD Manager để minh họa các chỉ số chung, kèm bảng giải thích phạm vi dữ liệu của từng vai trò. Menu cha/con dùng accordion: mặc định đóng, mỗi lần chỉ mở một mục cha; nút toggle chỉ đóng/mở nhóm, hỗ trợ bàn phím và không tự điều hướng nội dung.

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

Quy trình release web trước, Word sau:

1. `npm run build` và `npm run test:guide` xác minh nội dung web, cấu trúc mục, ảnh và trạng thái Word đang cập nhật.
2. Người phụ trách duyệt nội dung web canonical. Không chạy tạo Word trước bước duyệt này.
3. Sau khi web được duyệt, `npm run build:word` sinh lại duy nhất `public/downloads/huong-dan-qaqc.docx`; sau đó mới mở lại nút tải và kiểm tra đồng bộ web/Word.

`npm run build:word` không chạy trong giai đoạn nội dung web còn chờ duyệt; `npm run build` không tự sinh lại Word.

## Phạm vi Training Phase 2

Sáu vai trò trong scope: TnD Manager, Taskforce, COO, OM, AM và SM. Operation Head (OH) là vai trò dự phòng, ngoài phạm vi hướng dẫn.

- Dashboard: mục `13.1` gộp TnD Manager, COO và OM vì cùng nhóm chỉ số nhưng khác phạm vi dữ liệu; chỉ dùng ảnh Dashboard TnD Manager và bảng phạm vi vai trò. Các mục `13.2`–`13.4` lần lượt là **Dashboard Taskforce**, **Dashboard AM** và **Dashboard SM**.
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
