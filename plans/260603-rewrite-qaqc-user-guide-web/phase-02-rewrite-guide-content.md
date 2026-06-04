---
phase: 2
title: Rewrite guide content
status: completed
priority: P1
effort: 1.5d
dependencies:
  - 1
---

# Phase 2: Rewrite guide content

## Overview

Thay noi dung guide cu bang ban huong dan moi, viet theo nguoi dung that su dang thao tac app. Phase nay la trong tam: viet chi tiet tung flow va gan anh minh hoa dung.

## Requirements

- Functional: user guide moi phai bao phu cac flow chinh va cac tinh nang moi da chot.
- Non-functional: ngon ngu tieng Viet de hieu, cau truc dong nhat, khong noi lan man ky thuat.

## Architecture

Uu tien giu schema hien co cua `GuideBlock`: paragraph, label, steps, bullets, table, image. Neu can "luu y nghiep vu", dung `label` + `bullets` truoc; chi them block moi neu schema hien co khong du de doc dep.

Format moi cho moi feature:
1. Muc dich.
2. Ai dung.
3. Cach thao tac.
4. Nguoi dung se thay gi.
5. Luu y nghiep vu.
6. Anh minh hoa.

## Related Code Files

- Modify: `outputs/qaqc-user-guide-web/src/content/guide-content.json`
- Modify if type needs extension: `outputs/qaqc-user-guide-web/src/content/guide-content.ts`
- Modify if type needs extension: `outputs/qaqc-user-guide-web/src/components/guide-block-renderer.tsx`

## Implementation Steps

1. Cap nhat metadata guide:
   - Title: "Huong dan su dung he thong QA/QC Maycha".
   - Version: "Ban cap nhat 01/06/2026".
   - Scope: dashboard, audit, result, action plan, notification, master data.
   - Notice: day la ban huong dan web moi, Word se dong bo sau.
2. Viet chuong Tong quan:
   - Giai thich app dung de quan ly ke hoach audit, cham audit, xac nhan diem, theo doi loi va Action Plan.
   - Bang vai tro: Admin/QAM, AM, QC, SM.
   - Luong tong quat: Plan -> QC audit -> SM confirm/auto confirm -> Action Plan neu co loi that -> Dashboard/Report.
3. Viet Dang nhap va chon vai tro:
   - Dang nhap bang tai khoan duoc cap.
   - Doi mat khau neu he thong yeu cau.
   - Neu co nhieu vai tro, chon role tren header; menu va data se thay doi theo role.
4. Viet Dashboard:
   - Admin/QAM: theo doi tong quan toan bo pham vi duoc quan ly.
   - AM: chi xem store thuoc AM phu trach.
   - QC: xem viec duoc giao, tien do, hieu suat theo ngay co audit.
   - SM: xem store phu trach, audit gan day, Action Plan can xu ly.
   - Filter: tu ngay-den ngay, brand, AM, cua hang, loai cua hang, checklist.
   - Multi-select: dropdown co tick de chon nhieu brand/AM/store/checklist.
   - Brand loc danh sach cua hang theo brand da chon.
   - Doi loai cua hang thi checklist quay ve tat ca cua loai do.
5. Viet Ke hoach audit:
   - Danh sach plan, trang thai, mo chi tiet.
   - Tao/cau hinh plan: checklist, store, QC, ky audit, publish.
   - Flow bu diem:
     - Chi dung voi audit plan dang open.
     - Chi hien store chua co diem/chua cham trong plan.
     - Hien diem gan nhat da submit de QAM tham khao.
     - QAM nhap diem tay hoac copy hang loat cho store chua nhap.
     - Payload chi gui row co diem.
     - Neu recheck thay store da co diem hoac khong con hop le thi bao do, khong update store do; bam Refresh de tai lai danh sach hop le.
     - Sau khi bu diem, audit session phai ghi nhan nguoi cham dung la QAM/nguoi thao tac de QC dashboard khong tinh sai.
     - Validate diem theo thang diem checklist, khong mac dinh 0-100 vi co checklist 200/300 diem.
6. Viet QC thuc hien audit:
   - QC mo bai duoc giao.
   - Cham tung tieu chi, nhap loi tru diem, Risk/CCP neu co, them anh bang chung.
   - Luu nhap va submit.
   - Ghi nhan 0 diem:
     - Dung khi QC can note/nhan xet/quan sat nhung khong tru diem.
     - Khong tru diem tong.
     - Khong tinh vao tong loi/vi pham.
     - Khong tao Action Plan.
7. Viet Ket qua audit va Export Excel:
   - Xem danh sach ket qua theo role.
   - Filter theo tu ngay-den ngay, AM, cua hang, Brand va pham vi quyen.
   - Nut Xuat Excel nam tren man Ket qua audit.
   - File export lay dung du lieu theo filter; noi dung cot theo form QA/QC cung cap.
   - Detail ket qua hien diem, checklist, store, QC/QAM, findings, anh va ghi chu 0 diem neu co.
8. Viet Xac nhan diem va Action Plan:
   - SM xac nhan diem sau khi QC submit.
   - Neu qua 48h SM khong thao tac, he thong tu dong xac nhan theo diem da nop.
   - Chi tao/theo doi Action Plan khi audit co loi that su.
   - Ghi nhan 0 diem va bu diem khong co loi thi khong tao Action Plan.
   - SM/nguoi phu trach cap nhat nguyen nhan, han xu ly, bang chung, dong Action Plan.
9. Viet Thong bao:
   - Thong bao bai audit, xac nhan diem, auto confirm, Action Plan moi/sap qua han/qua han.
   - SM mobile can co anh rieng de nguoi dung biet cach xu ly tren dien thoai.
10. Viet Quan tri du lieu nen:
   - Brand, store, user, role, tieu chi, checklist.
   - Giai thich ngan vi cac muc nay anh huong filter, audit plan va dashboard.
11. Viet FAQ:
   - Tai sao dashboard khong co data?
   - Tai sao cua hang khong hien trong filter?
   - Khi nao Action Plan duoc tao?
   - Ghi nhan 0 diem co tinh loi khong?
   - Bu diem co tao loi/Action Plan khong?
   - Tai sao store khong hien trong danh sach chua co diem?
   - Ai la nguoi cham khi QAM bu diem?

## Success Criteria

- [ ] Noi dung cu khong con la noi dung chinh.
- [ ] Moi feature moi 01/06/2026 co muc huong dan rieng.
- [ ] Moi dashboard role co anh va mo ta dung pham vi du lieu.
- [ ] Cac rule nghiep vu quan trong duoc viet ro, khong gay hieu nham.
- [ ] Khong chay `extract:guide` tu Word cu trong phase nay.

## Risk Assessment

- Risk: Viet qua ky thuat, nguoi dung van kho hieu.
  Mitigation: moi muc bat dau bang muc dich va cach thao tac, sau do moi den luu y.
- Risk: Diem bu bi hieu la audit that co loi.
  Mitigation: tach ro "bu diem thong ke" voi "audit co finding".
