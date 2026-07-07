const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

const full = '/assets/user-guide/2026-06-full-guide/';
const upd = '/assets/user-guide/2026-06-feature-update/';
const setup = '/assets/user-guide/2026-06-setup-guide/';
const auditPlanGuide = '/assets/user-guide/2026-06-audit-plan-guide/';
const auditExecutionGuide = '/assets/user-guide/2026-06-audit-execution-guide/';
const actionPlanGuide = '/assets/user-guide/2026-06-action-plan-guide/';
const notificationGuide = '/assets/user-guide/2026-06-notification-guide/';
const refresh = '/assets/user-guide/2026-07-guide-refresh/';
const old = (number) => `/assets/user-guide/figure-${String(number).padStart(3, '0')}.png`;

const p = (text) => ({ type: 'paragraph', text });
const label = (text) => ({ type: 'label', text });
const steps = (items) => ({ type: 'steps', items });
const bullets = (items) => ({ type: 'bullets', items });
const table = (headers, rows) => ({ type: 'table', headers, rows });
const image = (src, alt, caption) => ({ type: 'image', src, alt, caption });
const audience = (text) => [label('Dành cho'), p(text)];
const section = (id, title, level, blocks) => ({ id, title, level, blocks });

const sections = [
  section('tong-quan', '1. Tổng quan hệ thống', 1, [
    ...audience('Tất cả role. Đọc mục này để hiểu phạm vi hệ thống và luồng vận hành tổng quát.'),
    p('Tài liệu này là bản hướng dẫn web đầy đủ cho hệ thống QA/QC Maycha. Nội dung kế thừa bản guide cũ và cập nhật theo hệ thống hiện tại: dashboard theo role, filter chọn nhiều, luồng audit cho cửa hàng quản lý/nhượng quyền, preset tính điểm nhượng quyền, export Excel, tự động xác nhận điểm sau 120 giờ và Action Plan sau khi điểm được xác nhận.'),
    table(['Vai trò', 'Phạm vi dữ liệu', 'Màn hình thường dùng'], [
      ['Admin / Company Admin', 'Quản trị dữ liệu nền và xem dashboard điều hành toàn hệ thống', 'Dashboard, Thương hiệu, Cửa hàng, Địa bàn, Người dùng'],
      ['COO', 'Quản lý tất cả brand, xem dashboard và báo cáo tổng hợp toàn công ty', 'Dashboard, Kết quả audit, Action Plan, Báo cáo'],
      ['OM', 'Quản lý các brand được phân công', 'Dashboard OM, Kết quả audit, Action Plan'],
      ['QA Manager / QAM', 'Điều phối QA/QC, quản lý checklist, audit plan, kết quả và Action Plan', 'Dashboard, Tiêu chí, Checklist, Kế hoạch audit, Kết quả audit, Action Plan'],
      ['QC Audit', 'Nhận bài audit và thực hiện chấm điểm', 'Dashboard QC, Thực hiện audit, Kết quả audit'],
      ['AM', 'Theo dõi các cửa hàng được phân công', 'Dashboard AM, Kết quả audit, Action Plan'],
      ['SM', 'Theo dõi cửa hàng, xác nhận điểm và xử lý Action Plan', 'Dashboard SM, Kết quả audit, Action Plan, Thông báo'],
    ]),
    label('Luồng vận hành tổng quát'),
    steps([
      'Admin/QA chuẩn bị dữ liệu nền: brand, cửa hàng, người dùng, tiêu chí, checklist.',
      'QA tạo và phát hành kế hoạch audit.',
      'QC nhận bài, kiểm tra cửa hàng, lưu nháp hoặc submit bài audit.',
      'SM xác nhận điểm; nếu quá 120 giờ chưa xác nhận, hệ thống tự xác nhận.',
      'Nếu có lỗi trừ điểm thật sự, Action Plan được tạo hoặc theo dõi để xử lý.',
      'Dashboard và kết quả audit cập nhật theo dữ liệu đã submit hoặc điểm bù cuối kỳ.',
    ]),
  ]),

  section('dang-nhap', '2. Đăng nhập và tài khoản', 1, [
    ...audience('Tất cả người dùng có tài khoản hệ thống QA/QC.'),
    p('Người dùng cần đăng nhập đúng tài khoản và đúng vai trò để hệ thống hiển thị đúng menu, dữ liệu và quyền thao tác.'),
  ]),
  section('dang-nhap-1', '2.1. Đăng nhập', 2, [
    ...audience('Tất cả người dùng.'),
    label('Mục đích'),
    p('Đăng nhập vào hệ thống bằng email và mật khẩu được cấp.'),
    label('Cách thao tác'),
    steps(['Mở đường dẫn hệ thống QA/QC.', 'Nhập email.', 'Nhập mật khẩu.', 'Bấm Đăng nhập.']),
    label('Người dùng sẽ thấy gì'),
    bullets(['Nếu đúng tài khoản, hệ thống mở dashboard theo vai trò.', 'Nếu sai tài khoản hoặc mật khẩu, hệ thống báo không thể đăng nhập.']),
    image(full + '00-login-page.png', 'Màn hình đăng nhập', 'Màn hình đăng nhập hiện tại.'),
  ]),
  section('dang-nhap-2', '2.2. Đổi mật khẩu lần đầu hoặc đổi mật khẩu tài khoản', 2, [
    ...audience('Tất cả người dùng; Admin/QA hỗ trợ cấp lại mật khẩu khi cần.'),
    label('Mục đích'),
    p('Tài khoản dùng mật khẩu tạm phải đổi mật khẩu trước khi dùng hệ thống. Người dùng cũng có thể đổi mật khẩu từ menu tài khoản nếu được phép.'),
    label('Cách thao tác'),
    steps(['Nhập mật khẩu hiện tại.', 'Nhập mật khẩu mới.', 'Nhập lại mật khẩu mới.', 'Bấm Cập nhật mật khẩu.']),
    label('Lưu ý'),
    bullets(['Mật khẩu mới không nên trùng mật khẩu tạm.', 'Nếu quên mật khẩu, liên hệ Admin/QA để được cấp lại theo quy trình nội bộ.']),
    image(old(2), 'Màn hình đổi mật khẩu', 'Màn hình đổi mật khẩu.'),
    image(old(3), 'Thông báo đổi mật khẩu', 'Thông báo sau khi đổi mật khẩu hoặc yêu cầu đổi mật khẩu.'),
  ]),

  section('dashboard', '3. Dashboard theo vai trò', 1, [
    ...audience('Tất cả role có dashboard. Người dùng đọc mục con đúng với role đang đăng nhập.'),
    p('Dashboard là nơi xem nhanh tình hình QA/QC. Mỗi vai trò nhìn thấy dashboard khác nhau theo phạm vi quyền và dữ liệu được phân công.'),
    label('Cách đọc chung'),
    p('Người dùng nên bắt đầu bằng khoảng Từ ngày - Đến ngày, sau đó lọc theo loại cửa hàng, thương hiệu, AM, cửa hàng và checklist nếu màn hình có các filter này.'),
    p('Các dropdown trên dashboard hỗ trợ chọn nhiều giá trị. Khi chọn thương hiệu, danh sách cửa hàng chỉ còn cửa hàng thuộc thương hiệu đã chọn. Khi đổi loại cửa hàng, checklist sẽ quay về danh sách phù hợp với loại cửa hàng mới.'),
    p('Dashboard đang thống kê theo checklist vì checklist quản lý và checklist nhượng quyền có thể khác thang điểm. Với cửa hàng nhượng quyền, các chỉ số nghiêm trọng hiển thị theo F-Risk/F-CCP để tách khỏi Risk/CCP của cửa hàng quản lý.'),
    p('Bộ ảnh dashboard trong mục này được chụp với filter tháng 6/2026, từ 01/06/2026 đến 30/06/2026, để các chỉ số có dữ liệu minh họa rõ ràng.'),
  ]),
  section('dashboard-admin', '3.1. Dashboard Admin', 2, [
    ...audience('Admin/Company Admin.'),
    label('Mục đích'),
    p('Dashboard Admin dùng để xem toàn cảnh chất lượng QA/QC của toàn công ty và kiểm tra dữ liệu vận hành ở cấp hệ thống.'),
    bullets(['Bộ lọc chính: loại cửa hàng, khoảng ngày, thương hiệu, AM, cửa hàng và checklist.', 'Chỉ số chính: điểm trung bình, số cửa hàng đã chấm, tổng lỗi, Risk/CCP hoặc F-Risk/F-CCP, lỗi lặp lại và tiến độ audit plan.', 'Các khối phân tích gồm chất lượng cửa hàng, phân tích lỗi theo nhóm, xu hướng điểm, vấn đề trọng yếu, top cửa hàng có nhiều lỗi và top tiêu chí bị lỗi nhiều.']),
    image(refresh + '03-admin-desktop-dashboard-overview.png', 'Dashboard Admin', 'Dashboard Admin với filter tháng 6/2026.'),
  ]),
  section('dashboard-coo', '3.2. Dashboard COO', 2, [
    ...audience('COO, xem dữ liệu tổng hợp tất cả brand.'),
    label('Mục đích'),
    p('Dashboard COO dùng để theo dõi chất lượng QA/QC ở phạm vi tất cả brand. Màn hình tập trung vào góc nhìn điều hành tổng hợp, không đi theo một brand đơn lẻ.'),
    bullets(['COO đọc cùng nhóm chỉ số điều hành như Admin nhưng mục tiêu chính là so sánh tình hình giữa các brand, loại cửa hàng và khu vực.', 'Bộ lọc chính: loại cửa hàng, khoảng ngày, thương hiệu, AM, cửa hàng và checklist.', 'Khi cần xử lý sâu, COO đi tiếp sang Kết quả audit hoặc Action Plan để xem chi tiết lỗi và tình trạng khắc phục.']),
    image(refresh + '03-coo-desktop-dashboard-overview.png', 'Dashboard COO', 'Dashboard COO với filter tháng 6/2026.'),
  ]),
  section('dashboard-qam', '3.3. Dashboard QAM', 2, [
    ...audience('QA Manager/QAM.'),
    label('Mục đích'),
    p('Dashboard QAM dùng để theo dõi nhịp vận hành QA/QC, phát hiện cửa hàng điểm thấp, nhóm lỗi nổi bật và vấn đề cần ưu tiên xử lý.'),
    bullets(['QAM có đầy đủ filter như Admin trong phạm vi QA/QC.', 'Có thể đổi Top 5/10/15/20, đổi độ chi tiết xu hướng theo ngày/tuần/tháng và xem so sánh theo ngày/tuần/tháng/năm.', 'Khi cần xử lý sâu, QAM đi tiếp sang Kế hoạch audit, Kết quả audit hoặc Action Plan.']),
    image(refresh + '03-qam-desktop-dashboard-overview.png', 'Dashboard QAM', 'Dashboard QAM với filter tháng 6/2026.'),
  ]),
  section('dashboard-am', '3.4. Dashboard AM', 2, [
    ...audience('AM, xem các cửa hàng được phân công.'),
    label('Mục đích'),
    p('Dashboard AM dùng để theo dõi chất lượng các cửa hàng được phân công. Cấu trúc phân tích giống QAM nhưng dữ liệu được giới hạn theo store scope của AM.'),
    bullets(['AM không cần tự lọc AM của chính mình; hệ thống tự giới hạn theo cửa hàng được phân công.', 'AM xem điểm trung bình, cửa hàng đã chấm, tổng lỗi, Risk/CCP hoặc F-Risk/F-CCP, xu hướng điểm và các cửa hàng có nhiều vấn đề nhất.', 'Dashboard giúp AM ưu tiên hỗ trợ cửa hàng và phối hợp với QA/SM khi có Action Plan.']),
    image(refresh + '03-am-desktop-dashboard-overview.png', 'Dashboard AM', 'Dashboard AM với filter tháng 6/2026 theo các cửa hàng được phân công.'),
  ]),
  section('dashboard-om', '3.5. Dashboard OM', 2, [
    ...audience('OM, xem các brand được phân công.'),
    label('Mục đích'),
    p('OM quản lý các brand được phân công. Dashboard OM dùng cùng cấu trúc phân tích điều hành nhưng bộ lọc và dữ liệu được giới hạn theo brand scope của OM.'),
    bullets(['OM có thể xem nhiều cửa hàng trong brand phụ trách, không xem ngoài brand được phân công.', 'Các biểu đồ và bảng lỗi vẫn đọc như dashboard Admin/QAM.', 'Khi cần drill-down, OM mở Kết quả audit hoặc Action Plan theo phạm vi brand của mình.']),
    image(refresh + '03-om-desktop-dashboard-overview.png', 'Dashboard OM', 'Dashboard OM với filter tháng 6/2026 theo brand được phân công.'),
  ]),
  section('dashboard-qc', '3.6. Dashboard QC', 2, [
    ...audience('QC Audit.'),
    label('Mục đích'),
    p('Dashboard QC dùng để QC theo dõi công việc cá nhân và các bài audit được giao.'),
    bullets(['Bộ lọc chính: loại cửa hàng, khoảng ngày, thương hiệu, trạng thái task và cửa hàng.', 'Chỉ số chính: store audit được giao, tiến độ plan, hiệu suất cá nhân, xu hướng điểm và cơ cấu lỗi.', 'Bài đang chấm chỉ là tiến độ, chưa được tính như kết quả cuối cùng cho tới khi submit.']),
    image(refresh + '03-qc-desktop-dashboard-overview.png', 'Dashboard QC', 'Dashboard QC với filter tháng 6/2026.'),
  ]),
  section('dashboard-sm', '3.7. Dashboard SM', 2, [
    ...audience('SM/Store Manager, xem cửa hàng mình phụ trách.'),
    label('Mục đích'),
    p('Dashboard SM dùng để Store Manager theo dõi chất lượng cửa hàng mình phụ trách.'),
    bullets(['Bộ lọc chính: checklist và khoảng ngày.', 'Chỉ số chính: điểm gần nhất, điểm trung bình, Action Plan đang mở/quá hạn, tiến độ minh chứng, lịch sử audit, lỗi nghiêm trọng và xu hướng điểm.', 'SM dùng dashboard để mở nhanh Action Plan cần cập nhật và kiểm tra các lỗi còn tồn tại.']),
    image(refresh + '03-sm-desktop-dashboard-overview.png', 'Dashboard SM', 'Dashboard SM với filter tháng 6/2026, chụp từ cửa hàng có dữ liệu audit trong kỳ.'),
  ]),

  section('du-lieu-nen', '4. Thiết lập dữ liệu nền', 1, [
    ...audience('Admin/Company Admin; QAM/QA nếu được cấp quyền quản trị dữ liệu nền.'),
    p('Dữ liệu nền là phần Admin cần thiết lập trước khi QA tạo checklist hoặc audit plan. Cấu hình đúng giúp dashboard, bộ lọc, phạm vi dữ liệu theo vai trò và các bài audit hiển thị chính xác.'),
    label('Thứ tự thiết lập khuyến nghị'),
    steps(['Tạo hoặc kiểm tra thương hiệu.', 'Tạo tỉnh/thành và xã/phường cần dùng.', 'Tạo cửa hàng, gắn thương hiệu, AM, địa bàn và tài khoản SM.', 'Tạo người dùng nội bộ, chọn bộ phận, vai trò và phạm vi quyền.', 'Đăng nhập thử hoặc kiểm tra danh sách để xác nhận dữ liệu vừa tạo đã đúng.']),
    label('Mối liên hệ giữa các nhóm dữ liệu'),
    table(['Nhóm dữ liệu', 'Ảnh hưởng chính', 'Cần kiểm tra sau khi lưu'], [
      ['Thương hiệu', 'Cửa hàng, dashboard, kết quả audit và checklist theo brand', 'Brand xuất hiện đúng tên trong danh sách và dropdown'],
      ['Địa bàn', 'Địa chỉ và bộ lọc cửa hàng', 'Xã/phường nằm đúng tỉnh/thành và có trạng thái hoạt động'],
      ['Cửa hàng', 'Audit plan, dashboard AM/SM, kết quả audit và Action Plan', 'Đúng brand, AM, loại cửa hàng, địa bàn và tài khoản SM'],
      ['Người dùng', 'Menu, chức năng và phạm vi dữ liệu được phép xem', 'Đúng bộ phận, role, trạng thái và phạm vi quyền'],
    ]),
    label('Ai thực hiện'),
    p('Thông thường chỉ Admin hoặc tài khoản được cấp quyền quản trị dữ liệu nền mới nhìn thấy và thao tác các màn hình trong mục này.'),
  ]),
  section('du-lieu-brand', '4.1. Thương hiệu', 2, [
    ...audience('Admin/Company Admin hoặc tài khoản được cấp quyền quản trị thương hiệu.'),
    label('Mục đích'),
    p('Thương hiệu dùng để nhóm cửa hàng và là một trong các bộ lọc chính trên dashboard, kết quả audit và các màn hình vận hành. Hãy tạo thương hiệu trước khi tạo cửa hàng.'),
    label('Tạo thương hiệu mới'),
    steps(['Vào Thiết lập > Thương hiệu.', 'Kiểm tra danh sách để tránh tạo trùng mã hoặc tên thương hiệu.', 'Bấm Tạo thương hiệu.', 'Chọn logo nếu có, nhập Mã thương hiệu, Tên thương hiệu và chọn Trạng thái.', 'Bấm Tạo thương hiệu.', 'Kiểm tra thương hiệu mới xuất hiện trong danh sách và có thể được chọn khi tạo cửa hàng.']),
    label('Các trường cần hiểu'),
    bullets(['Logo thương hiệu: ảnh nhận diện brand; hệ thống nhận JPEG, PNG hoặc WEBP, tối đa 20 MB.', 'Mã thương hiệu: mã định danh dùng để liên kết dữ liệu. Mã không thể chỉnh sửa trong chế độ cập nhật và không nên thay đổi sau khi đã có cửa hàng.', 'Tên thương hiệu: tên người dùng nhìn thấy trong danh sách và dropdown.', 'Trạng thái: thương hiệu ngưng hoạt động không nên dùng cho cửa hàng hoặc luồng vận hành mới.']),
    label('Chỉnh sửa thương hiệu'),
    steps(['Tại danh sách thương hiệu, bấm Sửa ở dòng cần cập nhật.', 'Cập nhật tên, trạng thái hoặc logo.', 'Bấm Lưu thay đổi.', 'Kiểm tra tên/trạng thái mới trên danh sách và các dropdown liên quan.']),
    label('Lưu ý'),
    bullets(['Kiểm tra kỹ trước khi ngưng hoạt động một thương hiệu đang có cửa hàng.', 'Nếu brand không xuất hiện trong dropdown cửa hàng, kiểm tra trạng thái brand và tải lại dữ liệu.']),
    image(setup + '01-brands-list-admin.png', 'Danh sách thương hiệu', 'Danh sách thương hiệu và trạng thái hiện tại.'),
    image(setup + '02-brand-create-drawer-filled.png', 'Form tạo thương hiệu', 'Nhập thông tin khi tạo thương hiệu mới.'),
  ]),
  section('du-lieu-location', '4.2. Địa bàn', 2, [
    ...audience('Admin/Company Admin hoặc tài khoản được cấp quyền quản trị địa bàn.'),
    label('Mục đích'),
    p('Địa bàn chuẩn hóa địa chỉ cửa hàng theo hai cấp: tỉnh/thành và xã/phường. Hãy tạo địa bàn trước khi tạo cửa hàng để dropdown địa chỉ có đủ lựa chọn.'),
    label('Tạo tỉnh/thành'),
    steps(['Vào Thiết lập > Địa bàn.', 'Tìm theo tên hoặc mã để tránh tạo trùng.', 'Bấm Tạo tỉnh / thành.', 'Nhập Mã tỉnh / thành, Tên tỉnh / thành và chọn Trạng thái.', 'Bấm Tạo tỉnh / thành.', 'Kiểm tra tỉnh/thành xuất hiện trong danh sách.']),
    image(full + '04-admin-locations-list.png', 'Danh sách tỉnh thành', 'Danh sách tỉnh/thành và trạng thái hiện tại.'),
    image(setup + '08-province-create-drawer-filled.png', 'Form tạo tỉnh thành', 'Nhập thông tin khi tạo tỉnh/thành.'),
    label('Tạo xã/phường'),
    steps(['Tại danh sách tỉnh/thành, bấm Chi tiết ở tỉnh/thành cần quản lý.', 'Kiểm tra đang mở đúng tỉnh/thành trên bộ chọn phía trên.', 'Bấm Tạo xã / phường.', 'Nhập Mã xã / phường, Tên xã / phường và chọn Trạng thái.', 'Bấm Tạo xã / phường.', 'Kiểm tra xã/phường xuất hiện trong danh sách của đúng tỉnh/thành.']),
    image(setup + '09-wards-list-detail-admin.png', 'Danh sách xã phường', 'Danh sách xã/phường thuộc tỉnh/thành đang chọn.'),
    image(setup + '10-ward-create-drawer.png', 'Form tạo xã phường', 'Form tạo xã/phường hiển thị tỉnh/thành được gắn cố định.'),
    label('Lưu ý'),
    bullets(['Mã tỉnh/thành và mã xã/phường là dữ liệu định danh; không thể sửa mã trong chế độ cập nhật.', 'Nếu cửa hàng không chọn được xã/phường, kiểm tra đã chọn tỉnh/thành trước và xã/phường đang hoạt động.', 'Khi đổi tỉnh/thành trong form cửa hàng, xã/phường đã chọn trước đó sẽ bị xóa nếu không còn hợp lệ.']),
  ]),
  section('du-lieu-store', '4.3. Cửa hàng', 2, [
    ...audience('Admin/Company Admin hoặc tài khoản được cấp quyền quản trị cửa hàng.'),
    label('Mục đích'),
    p('Cửa hàng là dữ liệu trung tâm của hệ thống QA/QC. Audit plan, dashboard, kết quả audit, Action Plan và phạm vi dữ liệu của AM/SM đều phụ thuộc vào cấu hình cửa hàng.'),
    label('Điều kiện trước khi tạo'),
    bullets(['Thương hiệu cần dùng đã tồn tại và đang hoạt động.', 'AM phụ trách đã có tài khoản phù hợp.', 'Tỉnh/thành và xã/phường của cửa hàng đã tồn tại.', 'Email dùng cho tài khoản cửa hàng chưa thuộc tài khoản khác.']),
    label('Tạo cửa hàng mới'),
    steps(['Vào Thiết lập > Cửa hàng.', 'Kiểm tra danh sách hoặc tìm theo mã/tên để tránh tạo trùng.', 'Bấm Tạo cửa hàng.', 'Nhập mã, tên, email cửa hàng và mật khẩu tạm cho tài khoản SM.', 'Chọn thương hiệu, AM phụ trách và loại cửa hàng.', 'Chọn tỉnh/thành trước, sau đó chọn xã/phường tương ứng và nhập địa chỉ chi tiết.', 'Chọn trạng thái và bấm Tạo cửa hàng.', 'Kiểm tra cửa hàng mới xuất hiện trong danh sách và tài khoản SM đã được tạo.']),
    label('Các trường cần hiểu'),
    table(['Trường', 'Ý nghĩa và ảnh hưởng'], [
      ['Mã và tên cửa hàng', 'Mã là duy nhất và xuất hiện trong audit plan, kết quả audit, dashboard; tên dùng để người dùng nhận diện.'],
      ['Email cửa hàng, mật khẩu tạm', 'Dùng để tạo tài khoản Store Manager chính khi tạo cửa hàng.'],
      ['Thương hiệu', 'Quyết định cửa hàng thuộc brand nào và ảnh hưởng các bộ lọc theo brand.'],
      ['AM phụ trách', 'Quyết định AM nào nhìn thấy cửa hàng trong phạm vi vận hành.'],
      ['Loại cửa hàng', 'Quản lý hoặc nhượng quyền; ảnh hưởng checklist và thống kê.'],
      ['Tỉnh/thành, xã/phường', 'Xã/phường chỉ hiển thị sau khi chọn tỉnh/thành và phải thuộc đúng tỉnh/thành đó.'],
      ['Trạng thái', 'Trạng thái cửa hàng đồng bộ với tài khoản SM chính; cửa hàng ngưng hoạt động không nên đưa vào kế hoạch audit mới.'],
    ]),
    image(setup + '03-stores-list-admin.png', 'Danh sách cửa hàng', 'Danh sách cửa hàng; có thể tìm và lọc theo dữ liệu vận hành.'),
    image(setup + '04-store-create-drawer-filled-basic.png', 'Form tạo cửa hàng thông tin cơ bản', 'Nhập thông tin cơ bản và tài khoản SM khi tạo cửa hàng.'),
    label('Chỉnh sửa và kiểm tra cửa hàng'),
    steps(['Tìm cửa hàng theo mã hoặc tên.', 'Bấm Sửa tại dòng cửa hàng.', 'Kiểm tra lại brand, AM, loại cửa hàng, địa bàn và trạng thái trước khi lưu.', 'Sau khi lưu, dùng bộ lọc tương ứng để xác nhận cửa hàng nằm đúng phạm vi.']),
    label('Lưu ý'),
    bullets(['Mã cửa hàng không thể sửa sau khi tạo.', 'Nếu cửa hàng đã có tài khoản SM chính, form sửa không yêu cầu tạo lại email/mật khẩu.', 'Khóa hoặc ngưng hoạt động cửa hàng sẽ ảnh hưởng tài khoản SM và các luồng vận hành liên quan.']),
  ]),
  section('du-lieu-user', '4.4. Người dùng và phân quyền', 2, [
    ...audience('Admin/Company Admin hoặc tài khoản được cấp quyền quản trị người dùng.'),
    label('Mục đích'),
    p('Người dùng và phân quyền quyết định tài khoản đăng nhập được hay không, nhìn thấy menu nào, thao tác được chức năng nào và dữ liệu nào nằm trong phạm vi được giao.'),
    label('Phân biệt hai loại tài khoản'),
    table(['Loại tài khoản', 'Tạo tại đâu', 'Cách quản lý'], [
      ['Tài khoản SM chính của cửa hàng', 'Tạo cùng cửa hàng tại màn Cửa hàng', 'Email, role, cửa hàng phụ trách và trạng thái được quản lý theo cửa hàng.'],
      ['Người dùng nội bộ như Admin, QA, QC, AM', 'Tạo tại màn Người dùng', 'Admin chọn bộ phận, trạng thái, một hoặc nhiều role phù hợp.'],
    ]),
    label('Tạo người dùng nội bộ'),
    steps(['Vào Thiết lập > Người dùng.', 'Tìm theo tên/email để tránh tạo trùng.', 'Bấm Tạo người dùng.', 'Nhập họ tên, email, số điện thoại, chọn bộ phận và trạng thái tài khoản.', 'Nhập mật khẩu tạm có ít nhất 8 ký tự.', 'Kiểm tra phần Phân quyền, chọn role phù hợp; có thể bấm Thêm vai trò khi một tài khoản cần nhiều role.', 'Bấm Tạo người dùng.', 'Kiểm tra người dùng xuất hiện trong danh sách với đúng bộ phận, role và trạng thái.']),
    image(setup + '11-users-list-admin.png', 'Danh sách người dùng', 'Danh sách người dùng, bộ phận, role và trạng thái tài khoản.'),
    image(setup + '12-user-create-drawer-basic.png', 'Form tạo người dùng', 'Form tạo người dùng và phân quyền.'),
    label('Các trường và quy tắc quan trọng'),
    bullets(['Avatar: ảnh nhận diện, chấp nhận JPEG, PNG hoặc WEBP tối đa 20 MB.', 'Bộ phận: hệ thống dùng bộ phận để giới hạn các role phù hợp có thể chọn.', 'Trạng thái tài khoản: Hoạt động, Tạm ngưng hoặc Khóa.', 'Mật khẩu tạm: chỉ nhập khi tạo mới; người dùng phải đổi mật khẩu ở lần đăng nhập tiếp theo.', 'Một tài khoản có thể mang nhiều role; quyền được gộp từ các role đã gán.', 'Role toàn công ty không cần chọn cửa hàng; role theo cửa hàng chỉ nhìn thấy phạm vi được giao.']),
    label('Khóa hoặc mở lại tài khoản'),
    steps(['Tại danh sách người dùng, tìm tài khoản cần xử lý.', 'Bấm Khóa hoặc Mở lại.', 'Xác nhận thao tác.', 'Kiểm tra trạng thái mới trên danh sách.']),
    label('Đặt lại mật khẩu tạm'),
    steps(['Tại dòng người dùng, bấm Reset mật khẩu.', 'Nhập mật khẩu tạm mới có ít nhất 8 ký tự.', 'Bấm Đặt lại mật khẩu.', 'Thông báo người dùng đăng nhập bằng mật khẩu tạm mới và đổi mật khẩu.']),
    p('Sau khi đặt lại mật khẩu, toàn bộ phiên đăng nhập hiện tại của người dùng bị thu hồi và người dùng phải đổi mật khẩu ở lần đăng nhập tiếp theo.'),
    image(setup + '13-user-reset-password-modal.png', 'Form đặt lại mật khẩu', 'Đặt lại mật khẩu tạm cho người dùng đã chọn.'),
    label('Lưu ý với tài khoản SM'),
    bullets(['Không tạo tài khoản Store Manager chính từ màn Người dùng; hãy tạo từ màn Cửa hàng.', 'Khi sửa tài khoản SM trong màn Người dùng, chỉ một số thông tin cá nhân được phép cập nhật.', 'Trạng thái tài khoản SM đồng bộ theo trạng thái cửa hàng, vì vậy không khóa/mở trực tiếp như người dùng nội bộ.']),
  ]),

  section('tieu-chi-checklist', '5. Tiêu chí và Checklist', 1, [
    ...audience('QAM/Admin cấu hình; QC/SM/AM/OM/COO đọc kết quả theo checklist đã áp dụng.'),
    p('Tiêu chí và checklist là nền tảng của bài audit. QA/Admin cần cấu hình đúng loại cửa hàng, nhóm tiêu chí và cơ chế tính điểm để QC chấm đúng, dashboard thống kê đúng và Action Plan tạo đúng lỗi.'),
    p('Trước khi tạo tiêu chí hoặc checklist, cần xác định đối tượng áp dụng là cửa hàng quản lý hay cửa hàng nhượng quyền. Hai loại cửa hàng dùng chung flow thao tác, nhưng khác cách tính điểm và khác một số loại lỗi nghiêm trọng.'),
    table(['Loại cửa hàng', 'Dùng khi nào', 'Cơ chế tính điểm trong checklist', 'Loại lỗi đặc biệt cần chú ý'], [
      ['Cửa hàng quản lý', 'Cửa hàng do công ty trực tiếp vận hành/quản lý.', 'Có thể chọn Trọng số C/H/P/E hoặc Tổng điểm.', 'Risk và CCP nhóm.'],
      ['Cửa hàng nhượng quyền', 'Cửa hàng vận hành theo mô hình nhượng quyền.', 'Hệ thống dùng Điểm trừ cố định và 5 nhóm preset nhượng quyền.', 'F-CCP và F-Risk.'],
    ]),
    p('Trong guide này, các tên như Trọng số C/H/P/E, Tổng điểm, Điểm trừ cố định và Preset tính điểm nhượng quyền là đúng theo nhãn người dùng nhìn thấy trên giao diện.'),
  ]),
  section('tieu-chi', '5.1. Thư viện tiêu chí và nhóm tiêu chí', 2, [
    ...audience('QAM/Admin quản lý thư viện tiêu chí và nhóm tiêu chí.'),
    label('Mục đích'),
    p('Thư viện tiêu chí dùng để quản lý các tiêu chí sẽ đưa vào checklist. Mỗi tiêu chí cần có mã, tên, loại cửa hàng áp dụng, loại tiêu chí, nhóm tiêu chí và trạng thái hoạt động.'),
    bullets(['Loại cửa hàng cho biết tiêu chí dùng cho cửa hàng quản lý, cửa hàng nhượng quyền hoặc cả hai nếu nghiệp vụ cho phép.', 'Nhóm tiêu chí giúp gom tiêu chí theo khu vực chấm điểm, đồng thời là cơ sở để dashboard và bảng điểm hiển thị đúng nhóm.', 'Với cửa hàng nhượng quyền, nhóm tiêu chí còn quyết định quy tắc trừ điểm theo 5 preset do hệ thống quản lý.']),
    table(['Loại tiêu chí trên UI', 'Áp dụng cho', 'Người dùng cần hiểu'], [
      ['Thường', 'Cửa hàng quản lý và cửa hàng nhượng quyền', 'Tiêu chí chấm trực tiếp. Với cửa hàng quản lý dùng điểm nền và mức trừ tối đa của tiêu chí; với nhượng quyền dùng quy tắc điểm theo nhóm nhượng quyền.'],
      ['Risk / F-Risk', 'Risk dùng chung; khi áp dụng cho nhượng quyền hệ thống hiển thị là F-Risk', 'Đây là lỗi nghiêm trọng làm điểm bài audit về 0. Chỉ tạo khi đúng quy định QA/QC.'],
      ['CCP nhóm', 'Cửa hàng quản lý', 'Catalog lý do lỗi nghiêm trọng theo nhóm tiêu chí; không phải tiêu chí điểm thường trong section checklist.'],
      ['F-CCP', 'Cửa hàng nhượng quyền', 'Catalog lý do lỗi nghiêm trọng theo nhóm nhượng quyền; một bài có thể chọn nhiều lý do nhưng chỉ trừ 90 điểm một lần.'],
    ]),
    image(refresh + '05-qam-desktop-criteria-list-classification.png', 'Thư viện tiêu chí', 'Thư viện tiêu chí hiển thị phân loại tiêu chí, loại cửa hàng và nhóm tiêu chí.'),
  ]),
  section('tieu-chi-franchise-preset', '5.2. Preset tính điểm nhượng quyền', 2, [
    ...audience('QAM/Admin đọc để hiểu preset nhượng quyền; người dùng không tự sửa preset hệ thống.'),
    p('Preset tính điểm nhượng quyền là bảng quy tắc mặc định cho cửa hàng nhượng quyền. Người dùng không tự sửa các preset này; khi tạo nhóm tiêu chí nhượng quyền, QA chọn 1 trong 5 nhóm để hệ thống tự hiểu cách trừ điểm.'),
    table(['Nhóm preset trên giao diện', 'Cách hệ thống tính điểm', 'Dùng cho tình huống nào'], [
      ['I. Nhóm lỗi cơ bản', 'Chuẩn 1 điểm; nếu ghi nhận lỗi thì trừ 2 điểm; nếu là lỗi lặp lại thì trừ thêm 2 điểm.', 'Lỗi vận hành cơ bản, mức ảnh hưởng thấp.'],
      ['II. Nhóm lỗi có yếu tố rủi ro', 'Chuẩn 2 điểm; nếu ghi nhận lỗi thì trừ 5 điểm; nếu là lỗi lặp lại thì trừ thêm 5 điểm.', 'Lỗi có mức ảnh hưởng cao hơn lỗi cơ bản.'],
      ['III. Nhóm lỗi nghiêm trọng F-CCP', 'Trừ 90 điểm một lần cho toàn bài audit.', 'Các lý do F-CCP của cửa hàng nhượng quyền. Có thể chọn nhiều lý do nhưng không trừ lặp 90 điểm nhiều lần.'],
      ['IV. Nhóm lỗi đặc biệt nghiêm trọng F-Risk', 'Điểm bài audit về 0.', 'Lỗi nghiêm trọng nhất, chỉ dùng khi đúng quy định QA/QC.'],
      ['V. Bài thi kiểm tra kiến thức', '10 câu hỏi; mỗi câu sai trừ 4 điểm; tối đa trừ 40 điểm.', 'Phần kiểm tra kiến thức trong checklist nhượng quyền.'],
    ]),
    label('Lưu ý vận hành'),
    bullets(['Với cửa hàng nhượng quyền, người dùng chỉ chọn loại cửa hàng và nhóm preset; hệ thống tự áp dụng Điểm trừ cố định.', 'Không dùng cách gọi kỹ thuật trong trao đổi vận hành. Hãy gọi theo nhãn giao diện: Điểm trừ cố định, Trọng số C/H/P/E, Tổng điểm.', 'F-CCP cần ghi chú rõ từng lý do khi audit để QAM/SM đọc lại kết quả biết nguyên nhân cụ thể.']),
    image(refresh + '05-qam-desktop-criteria-franchise-preset-table.png', 'Preset tính điểm nhượng quyền', 'Bảng 5 preset tính điểm nhượng quyền do hệ thống quản lý.'),
  ]),
  section('tieu-chi-chi-tiet', '5.3. Tạo và chỉnh sửa tiêu chí / nhóm tiêu chí', 2, [
    ...audience('QAM/Admin tạo và chỉnh sửa tiêu chí hoặc nhóm tiêu chí.'),
    label('Cách thao tác'),
    steps(['Vào Tiêu chí.', 'Nếu cần tạo nhóm, mở tab Nhóm tiêu chí và bấm Thêm nhóm tiêu chí.', 'Chọn Loại cửa hàng áp dụng: Cửa hàng quản lý hoặc Cửa hàng nhượng quyền.', 'Với nhóm nhượng quyền, chọn Preset tính điểm nhượng quyền phù hợp.', 'Quay lại tab Tiêu chí, bấm Thêm tiêu chí hoặc sửa tiêu chí hiện có.', 'Nhập mã, tên, loại tiêu chí, nhóm tiêu chí, mô tả và trạng thái.', 'Kiểm tra lại quy tắc điểm hiển thị trên form trước khi lưu.']),
    label('Giải thích field quan trọng'),
    table(['Field', 'Ý nghĩa', 'Lưu ý'], [
      ['Loại cửa hàng áp dụng', 'Xác định tiêu chí/nhóm dùng cho cửa hàng quản lý hay nhượng quyền.', 'Chọn sai loại cửa hàng sẽ làm checklist/audit plan không lọc đúng dữ liệu.'],
      ['Loại tiêu chí', 'Xác định tiêu chí là Thường, Risk/F-Risk, CCP nhóm hoặc F-CCP.', 'Với nhóm preset nhượng quyền, hệ thống có thể tự suy ra loại tiêu chí phù hợp.'],
      ['Nhóm tiêu chí', 'Gắn tiêu chí vào nhóm để tính điểm và hiển thị dashboard/bảng điểm.', 'Tiêu chí chấm điểm, CCP nhóm, F-CCP và tiêu chí nhượng quyền đều cần nhóm phù hợp.'],
      ['Điểm nền / mức trừ tối đa', 'Điểm hệ thống dùng để tính mức ảnh hưởng của tiêu chí quản lý.', 'Chỉ áp dụng cho cơ chế điểm của cửa hàng quản lý.'],
      ['Preset tính điểm nhượng quyền', 'Quy tắc trừ điểm dùng cho nhóm nhượng quyền.', 'Chỉ xuất hiện khi nhóm áp dụng cho cửa hàng nhượng quyền.'],
    ]),
    bullets(['Mã tiêu chí nên ổn định vì xuất hiện trong audit, kết quả và file Excel.', 'Không đổi loại tiêu chí hoặc loại cửa hàng sau khi tiêu chí đã được dùng trong checklist nếu chưa rà soát dữ liệu liên quan.', 'Tiêu chí không hoạt động không nên đưa vào checklist mới.']),
  ]),
  section('checklist-list', '5.4. Thư viện checklist và phân loại cửa hàng', 2, [
    ...audience('QAM/Admin quản lý checklist; QC dùng checklist khi audit; các role khác xem kết quả phát sinh từ checklist.'),
    p('Thư viện checklist cho biết checklist đang áp dụng cho mô hình cửa hàng nào, tổng điểm bao nhiêu và trạng thái hiện tại là Nháp, Đang áp dụng hay Đã lưu trữ.'),
    table(['Khi tạo checklist', 'Người dùng sẽ thấy', 'Hệ thống xử lý'], [
      ['Chọn Cửa hàng quản lý', 'Cơ chế tính điểm cho phép chọn Trọng số C/H/P/E hoặc Tổng điểm.', 'Checklist dùng cho cửa hàng quản lý; audit plan/dashboard chỉ lấy khi lọc loại cửa hàng quản lý.'],
      ['Chọn Cửa hàng nhượng quyền', 'Cơ chế tính điểm tự chuyển thành Điểm trừ cố định.', 'Checklist dùng cho cửa hàng nhượng quyền; hệ thống áp dụng 5 nhóm preset nhượng quyền.'],
    ]),
    image(refresh + '05-qam-desktop-checklist-list-classification.png', 'Thư viện checklist', 'Danh sách checklist hiển thị mô hình cửa hàng và trạng thái checklist.'),
    image(refresh + '05-qam-desktop-checklist-create-managed-scoring.png', 'Tạo checklist cửa hàng quản lý', 'Khi chọn Cửa hàng quản lý, QA chọn Trọng số C/H/P/E hoặc Tổng điểm.'),
    image(refresh + '05-qam-desktop-checklist-create-franchise-scoring.png', 'Tạo checklist cửa hàng nhượng quyền', 'Khi chọn Cửa hàng nhượng quyền, hệ thống tự dùng Điểm trừ cố định.'),
  ]),
  section('checklist-cau-hinh', '5.5. Cấu hình checklist', 2, [
    ...audience('QAM/Admin cấu hình checklist trước khi đưa vào kế hoạch audit.'),
    label('Cách thao tác'),
    steps(['Tạo mới hoặc mở checklist nháp.', 'Kiểm tra Loại cửa hàng áp dụng trước khi thêm tiêu chí.', 'Thêm section/nhóm để chia cấu trúc bài audit.', 'Thêm tiêu chí phù hợp với loại cửa hàng của checklist.', 'Với checklist Trọng số C/H/P/E, nhập trọng số nhóm và đảm bảo tổng trọng số bằng 100%.', 'Với checklist Tổng điểm, kiểm tra tổng điểm tối đa của các tiêu chí.', 'Với checklist nhượng quyền, kiểm tra các nhóm preset và quy tắc trừ điểm trước khi publish.', 'Publish checklist khi đã rà soát xong để dùng trong audit plan.']),
    label('Lưu ý'),
    bullets(['Không dùng chung một checklist cho cả cửa hàng quản lý và cửa hàng nhượng quyền nếu nghiệp vụ cần hai hệ tính điểm khác nhau.', 'Checklist đã publish nên tạo version mới nếu cần thay đổi lớn để giữ lịch sử dữ liệu audit cũ.', 'Khi đổi loại cửa hàng ở dashboard hoặc audit plan, hệ thống chỉ hiển thị checklist phù hợp với loại cửa hàng đã chọn.']),
    image(refresh + '05-qam-desktop-checklist-franchise-list.png', 'Checklist nhượng quyền', 'Checklist nhượng quyền dùng nhóm preset và Điểm trừ cố định.'),
  ]),

  section('audit-plan', '6. Kế hoạch audit', 1, [
    ...audience('QAM/QA lập và quản lý kế hoạch; QC nhận bài sau khi kế hoạch phát hành.'),
    p('Kế hoạch audit là nơi QA lập kế hoạch chấm theo kỳ, chọn checklist, thêm các cửa hàng cần kiểm tra và phân công QC phụ trách. Kế hoạch đi theo ba trạng thái Nháp, Đang mở và Đã đóng; các thao tác được phép thay đổi theo từng trạng thái.'),
    table(['Trạng thái', 'Ý nghĩa', 'Thao tác chính'], [
      ['Nháp', 'Kế hoạch đang được chuẩn bị, chưa giao việc cho QC.', 'Chỉnh thông tin, thêm/bỏ cửa hàng, phân công QC, lưu thay đổi và phát hành.'],
      ['Đang mở', 'Kế hoạch đã phát hành và các bài audit đã được giao.', 'Theo dõi tiến độ, thay QC hoặc thêm cửa hàng chưa bắt đầu, bù điểm cửa hàng chưa được chấm, đóng kế hoạch.'],
      ['Đã đóng', 'Kế hoạch đã kết thúc và được giữ để tra cứu.', 'Chỉ xem thông tin, danh sách cửa hàng và kết quả đã ghi nhận.'],
    ]),
    label('Luồng thao tác khuyến nghị'),
    steps(['Tạo kế hoạch nháp và chọn đúng kỳ audit, loại cửa hàng, checklist.', 'Mở kế hoạch nháp, thêm cửa hàng và kiểm tra QC phụ trách.', 'Lưu thay đổi rồi phát hành kế hoạch.', 'Theo dõi trạng thái chấm của từng cửa hàng trong thời gian kế hoạch đang mở.', 'Cuối kỳ, bù điểm cho cửa hàng chưa được chấm nếu nghiệp vụ yêu cầu.', 'Đóng kế hoạch sau khi đã kiểm tra đầy đủ dữ liệu.']),
  ]),
  section('audit-plan-list', '6.1. Danh sách kế hoạch audit', 2, [
    ...audience('QAM/QA theo dõi danh sách kế hoạch audit.'),
    label('Mục đích'),
    p('Màn danh sách giúp QA theo dõi toàn bộ kế hoạch audit, nhận biết nhanh số kế hoạch đang mở, số cửa hàng đã được gán, số kế hoạch nháp và tổng số kế hoạch.'),
    label('Cách thao tác'),
    steps(['Vào Vận hành QA/QC > Kế hoạch audit.', 'Dùng ô tìm kiếm hoặc bộ lọc trạng thái để tìm kế hoạch cần xử lý.', 'Kiểm tra tên kế hoạch, kỳ audit, checklist, số cửa hàng và trạng thái.', 'Bấm Mở để xem chi tiết hoặc Sao chép để tạo một kế hoạch mới dựa trên kế hoạch hiện có.', 'Bấm Tạo kế hoạch audit khi cần bắt đầu một kỳ audit mới.']),
    label('Lưu ý'),
    bullets(['Trạng thái kế hoạch được hiển thị trực tiếp trên từng dòng.', 'Số cửa hàng cho biết phạm vi hiện tại của kế hoạch.', 'Sao chép tạo kế hoạch mới để tiếp tục chỉnh sửa, không sửa trực tiếp kế hoạch gốc.']),
    image(auditPlanGuide + '01-audit-plans-list.png', 'Danh sách kế hoạch audit', 'Danh sách kế hoạch audit và các chỉ số tổng quan.'),
  ]),
  section('audit-plan-create-draft', '6.2. Tạo kế hoạch nháp', 2, [
    ...audience('QAM/QA tạo kế hoạch nháp.'),
    label('Mục đích'),
    p('Tạo khung kế hoạch trước khi thêm cửa hàng và giao QC. Kế hoạch mới luôn được lưu ở trạng thái Nháp để QA kiểm tra trước khi phát hành.'),
    label('Cách thao tác'),
    steps(['Tại danh sách kế hoạch audit, bấm Tạo kế hoạch audit.', 'Nhập tên kỳ audit dễ nhận biết.', 'Chọn ngày bắt đầu và ngày kết thúc của kỳ audit.', 'Chọn loại cửa hàng. Danh sách checklist sẽ lấy theo loại cửa hàng đã chọn.', 'Chọn checklist đã được phát hành.', 'Bấm Tạo kế hoạch. Hệ thống mở màn chi tiết của kế hoạch nháp vừa tạo.']),
    label('Lưu ý'),
    bullets(['Form tạo mới chỉ tạo thông tin chung; cửa hàng và QC được cấu hình ở màn chi tiết sau đó.', 'Chỉ checklist đang hoạt động và đã phát hành mới có thể dùng để lập kế hoạch.', 'Tên và kỳ audit nên đủ rõ để phân biệt khi xem danh sách hoặc sao chép kế hoạch.']),
    image(auditPlanGuide + '02-create-audit-plan-form.png', 'Form tạo kế hoạch audit', 'Form tạo kế hoạch audit mới.'),
    image(auditPlanGuide + '03-create-audit-plan-filled.png', 'Form tạo kế hoạch đã nhập', 'Thông tin mẫu trước khi tạo kế hoạch nháp.'),
    image(auditPlanGuide + '04-audit-plan-draft-detail.png', 'Chi tiết kế hoạch nháp', 'Kế hoạch mới được tạo ở trạng thái Nháp.'),
  ]),
  section('audit-plan-assign-stores', '6.3. Thêm cửa hàng và phân công QC', 2, [
    ...audience('QAM/QA thêm cửa hàng và phân công QC.'),
    label('Mục đích'),
    p('Xác định các cửa hàng cần chấm trong kỳ và QC chịu trách nhiệm thực hiện audit tại từng cửa hàng.'),
    label('Cách thao tác'),
    steps(['Mở kế hoạch đang ở trạng thái Nháp.', 'Bấm Thêm store.', 'Tìm hoặc lọc cửa hàng theo thương hiệu, AM, tỉnh/thành hoặc xã/phường.', 'Tích chọn một hoặc nhiều cửa hàng rồi xác nhận thêm vào kế hoạch.', 'Kiểm tra QC Audit được gán cho từng cửa hàng; thay đổi QC nếu cần.', 'Bấm Lưu thay đổi trước khi phát hành.']),
    label('Người dùng sẽ thấy gì'),
    bullets(['Mỗi cửa hàng hiển thị mã, tên, thương hiệu, địa chỉ, trạng thái bài audit và QC Audit.', 'Hệ thống có thể đề xuất QC mặc định; QA vẫn cần kiểm tra người được giao có phù hợp.', 'Có thể thêm nhiều cửa hàng trong một lần bằng ô tích chọn.']),
    image(auditPlanGuide + '05-select-stores-modal.png', 'Danh sách chọn cửa hàng', 'Tìm kiếm và lọc cửa hàng cần thêm vào kế hoạch.'),
    image(auditPlanGuide + '06-select-stores-chosen.png', 'Chọn nhiều cửa hàng', 'Chọn nhiều cửa hàng trước khi thêm vào kế hoạch.'),
    image(auditPlanGuide + '07-audit-plan-stores-and-qc.png', 'Cửa hàng và QC trong kế hoạch', 'Kiểm tra danh sách cửa hàng và QC Audit được phân công.'),
  ]),
  section('audit-plan-publish-progress', '6.4. Phát hành và theo dõi tiến độ', 2, [
    ...audience('QAM/QA phát hành kế hoạch và theo dõi tiến độ.'),
    label('Phát hành kế hoạch'),
    steps(['Kiểm tra kế hoạch đã có ít nhất một cửa hàng.', 'Kiểm tra mọi cửa hàng đều có QC Audit.', 'Bấm Phát hành kế hoạch.', 'Đọc nội dung xác nhận rồi bấm Phát hành.']),
    p('Sau khi phát hành, trạng thái kế hoạch chuyển từ Nháp sang Đang mở và bài audit được giao cho QC. Trong khi kế hoạch đang mở, QA vẫn có thể bổ sung cửa hàng hoặc thay QC đối với các cửa hàng chưa bắt đầu audit.'),
    label('Theo dõi tiến độ'),
    bullets(['Theo dõi trạng thái từng cửa hàng: Chưa chấm, Đang chấm, Đã hoàn thành hoặc Đã bù điểm.', 'Kiểm tra QC Audit để biết người đang chịu trách nhiệm.', 'Dùng Cửa hàng chưa có điểm vào cuối kỳ khi cần xử lý các cửa hàng chưa được chấm.']),
    image(auditPlanGuide + '08-publish-audit-plan-confirm.png', 'Xác nhận phát hành kế hoạch', 'Xác nhận trước khi phát hành kế hoạch audit.'),
    image(auditPlanGuide + '09-open-audit-plan-detail.png', 'Kế hoạch audit đang mở', 'Chi tiết kế hoạch sau khi phát hành.'),
  ]),
  section('audit-plan-bu-diem', '6.5. Bù điểm cửa hàng chưa được chấm', 2, [
    ...audience('QAM/QA bù điểm cho cửa hàng chưa được chấm khi cần hoàn tất dữ liệu kỳ audit.'),
    label('Mục đích'),
    p('Cuối kỳ, QA có thể nhập điểm bù cho các cửa hàng chưa được QC chấm để dữ liệu thống kê của kỳ hiện tại đầy đủ hơn. Chức năng này chỉ dùng cho kế hoạch ở trạng thái Đang mở.'),
    label('Cách thao tác'),
    steps(['Mở kế hoạch đang ở trạng thái Đang mở.', 'Bấm Cửa hàng chưa có điểm.', 'Xem điểm gần nhất, checklist, ngày submit và người chấm gần nhất để tham khảo.', 'Nhập điểm bù thủ công cho từng cửa hàng hoặc bấm Sao chép tất cả điểm trống để điền điểm gần nhất vào các dòng chưa nhập.', 'Kiểm tra lại điểm rồi bấm Cập nhật điểm bù.', 'Sau khi cập nhật thành công, làm mới danh sách và kiểm tra trạng thái cửa hàng chuyển thành Đã bù điểm.']),
    label('Quy tắc quan trọng'),
    bullets(['Chỉ cửa hàng chưa được chấm mới xuất hiện; cửa hàng đang chấm, đã hoàn thành hoặc đã bù điểm không xuất hiện.', 'Nút Sao chép tất cả điểm trống chỉ điền các dòng chưa có giá trị, không ghi đè điểm QA đã nhập.', 'Khi cập nhật, hệ thống chỉ gửi các dòng có điểm; dòng để trống không bị thay đổi.', 'Điểm 0 là giá trị hợp lệ. Điểm được kiểm tra theo thang điểm của checklist, không mặc định giới hạn 0-100.', 'Điểm bù không có chi tiết lỗi và không tạo Action Plan.', 'Bài được bù điểm ghi nhận QA thực hiện là người chấm để thống kê QC không bị sai.', 'Nếu dữ liệu thay đổi trong lúc nhập và một cửa hàng không còn đủ điều kiện, hệ thống báo lỗi; bấm Làm mới để tải lại danh sách hợp lệ.']),
    image(auditPlanGuide + '10-missing-scores-drawer.png', 'Cửa hàng chưa có điểm', 'Danh sách cửa hàng chưa có điểm và điểm audit gần nhất để tham khảo.'),
    image(auditPlanGuide + '11-missing-scores-copy-ready.png', 'Điểm bù đã được sao chép', 'Các dòng chưa nhập được điền từ điểm gần nhất trước khi cập nhật.'),
    image(auditPlanGuide + '12-missing-scores-after-update.png', 'Danh sách sau khi cập nhật điểm bù', 'Danh sách không còn cửa hàng đủ điều kiện sau khi cập nhật điểm bù thành công.'),
    image(auditPlanGuide + '13-audit-plan-backfilled-status.png', 'Trạng thái đã bù điểm', 'Cửa hàng chuyển sang trạng thái Đã bù điểm sau khi cập nhật thành công.'),
  ]),
  section('audit-plan-close', '6.6. Đóng kế hoạch', 2, [
    ...audience('QAM/QA đóng kế hoạch sau khi kiểm tra tiến độ và dữ liệu.'),
    label('Mục đích'),
    p('Đóng kế hoạch khi kỳ audit đã kết thúc và QA đã kiểm tra xong tiến độ, kết quả và các điểm bù cần thiết.'),
    label('Cách thao tác'),
    steps(['Mở kế hoạch đang ở trạng thái Đang mở.', 'Kiểm tra lần cuối trạng thái của các cửa hàng.', 'Bấm Đóng kế hoạch.', 'Đọc cảnh báo và bấm Đóng kế hoạch để xác nhận.']),
    label('Lưu ý'),
    bullets(['Sau khi đóng, kế hoạch chuyển sang trạng thái Đã đóng và chỉ còn dùng để tra cứu.', 'Không thể thêm cửa hàng, thay QC hoặc bù điểm trên kế hoạch đã đóng.', 'Nên xử lý cửa hàng chưa có điểm trước khi đóng kế hoạch.']),
    image(auditPlanGuide + '14-close-audit-plan-confirm.png', 'Xác nhận đóng kế hoạch', 'Xác nhận trước khi đóng kế hoạch audit.'),
    image(auditPlanGuide + '15-closed-audit-plan-detail.png', 'Kế hoạch audit đã đóng', 'Chi tiết kế hoạch sau khi chuyển sang trạng thái Đã đóng.'),
  ]),

  section('audit-execution', '7. QC thực hiện audit', 1, [
    ...audience('QC thao tác chính; QAM chỉ vào màn này khi chỉnh sửa kết quả đã nộp trước khi điểm được xác nhận.'),
    p('Mục Thực hiện audit là nơi QC mở các bài được giao, ghi nhận kết quả kiểm tra tại cửa hàng, lưu nháp và gửi bài. Flow thao tác chung giống nhau cho cửa hàng quản lý và cửa hàng nhượng quyền: mở bài, chấm từng tiêu chí, thêm ghi chú/ảnh minh chứng nếu có lỗi, kiểm tra điểm tạm tính rồi gửi bài. Điểm khác nhau nằm ở UI chấm từng tiêu chí và cách hệ thống tính điểm.'),
    table(['Loại cửa hàng', 'UI chấm từng tiêu chí', 'Lỗi nghiêm trọng', 'Cách đọc điểm'], [
      ['Cửa hàng quản lý', 'QC chọn Pass, Lỗi trừ điểm hoặc ghi nhận Không trừ điểm; nhập số lỗi, lỗi lặp, ghi chú và ảnh minh chứng.', 'Dùng Risk và CCP nhóm. Risk đưa điểm toàn bài về 0; CCP nhóm áp dụng theo nhóm tiêu chí.', 'Điểm thay đổi theo số lỗi, lỗi lặp, CCP và tỷ trọng/điểm nhóm của checklist.'],
      ['Cửa hàng nhượng quyền', 'QC bật Có lỗi/Có lặp lại cho tiêu chí thường; riêng bài kiểm tra kiến thức nhập Số câu sai.', 'Dùng F-Risk và F-CCP. F-Risk đưa điểm toàn bài về 0; F-CCP trừ 90 điểm một lần cho toàn bài dù chọn nhiều lý do.', 'Điểm trừ theo nhóm nhượng quyền: nhóm lỗi cơ bản, nhóm có yếu tố rủi ro, nhóm F-CCP, nhóm F-Risk và bài thi kiến thức.'],
    ]),
  ]),
  section('audit-execution-list', '7.1. Danh sách bài audit được giao', 2, [
    ...audience('QC xem danh sách bài audit được giao.'),
    label('Mục đích'),
    p('Danh sách này giúp QC biết hôm nay cần audit cửa hàng nào, thuộc kế hoạch nào, dùng checklist nào và trạng thái hiện tại của từng task.'),
    steps(['Vào Thực hiện audit.', 'Lọc theo trạng thái nếu cần: tất cả, chờ thực hiện, đang thực hiện hoặc hoàn thành.', 'Đọc cột Cửa hàng để kiểm tra mã cửa hàng, tên cửa hàng và tag Quản lý/Nhượng quyền.', 'Bấm Thực hiện đánh giá để mở phiên audit của cửa hàng cần chấm.']),
    bullets(['Một QC chỉ nhìn thấy các cửa hàng được phân công trong kế hoạch đang mở.', 'Tag loại cửa hàng rất quan trọng vì quyết định UI chấm điểm và nhãn lỗi nghiêm trọng ở màn tiếp theo.', 'Task đã gửi bài sẽ chuyển sang trạng thái hoàn thành và mở lại theo chế độ xem kết quả.']),
    image(refresh + '07-qc-desktop-audit-execution-overview.png', 'Danh sách audit của QC', 'Danh sách bài audit được giao, có phân loại cửa hàng quản lý và nhượng quyền.'),
  ]),
  section('audit-execution-session', '7.2. Mở phiên audit', 2, [
    ...audience('QC mở và thao tác phiên audit được giao.'),
    label('Người dùng sẽ thấy gì'),
    bullets(['Header hiển thị cửa hàng, loại cửa hàng, kế hoạch, checklist, thời gian audit, người thực hiện và địa chỉ.', 'Thanh tóm tắt hiển thị điểm tạm tính, số mục vi phạm, lỗi lặp, CCP và Risk. Với nhượng quyền, nhãn trên thanh tóm tắt đổi sang F-CCP/F-Risk.', 'Danh sách tiêu chí được gom theo section để QC mở từng nhóm và chấm từng tiêu chí.', 'Ô tìm kiếm dùng để tìm nhanh theo mã tiêu chí, tên tiêu chí, mô tả hoặc nhóm.']),
    label('Lưu ý khi mở phiên'),
    bullets(['Phiên mới được tạo ở trạng thái nháp khi QC mở bài lần đầu.', 'Bài nháp có thể lưu nhiều lần trước khi gửi.', 'Dữ liệu chỉ trở thành kết quả audit chính thức sau khi QC gửi bài.']),
    image(refresh + '07-qc-desktop-audit-execution-session.png', 'Phiên audit QC', 'Phiên audit trên desktop với thông tin phiên, điểm tạm tính và danh sách tiêu chí.'),
  ]),
  section('audit-execution-managed-criteria', '7.3. Chấm tiêu chí cửa hàng quản lý', 2, [
    ...audience('QC chấm tiêu chí cho cửa hàng quản lý.'),
    p('Với cửa hàng quản lý, mỗi tiêu chí được chấm theo cách ghi nhận lỗi vận hành thông thường. QC cần chọn đúng trạng thái, nhập số lỗi và ghi chú đủ rõ để QAM/SM hiểu bối cảnh khi xem kết quả.'),
    table(['Trường/nút', 'Cách hiểu'], [
      ['Pass', 'Tiêu chí đạt, không ghi nhận lỗi và không trừ điểm.'],
      ['Lỗi trừ điểm', 'Tiêu chí không đạt và ảnh hưởng điểm. Khi chọn trạng thái này, QC nhập số lỗi ghi nhận, lỗi lặp nếu có và ghi chú lỗi.'],
      ['Không trừ điểm', 'Dùng cho ghi nhận/cảnh báo không ảnh hưởng điểm. Trạng thái này không tính lỗi trừ điểm và không tạo Action Plan.'],
      ['Số lỗi ghi nhận', 'Số lần lỗi thực tế được thấy tại thời điểm audit.'],
      ['Lỗi lặp ghi nhận', 'Số lần lặp lại của lỗi theo quy định nội bộ; lỗi lặp có thể làm tăng mức ảnh hưởng điểm.'],
      ['CCP', 'Đánh dấu khi tiêu chí thuộc lỗi kiểm soát nghiêm trọng theo quy định cửa hàng quản lý.'],
      ['Ghi chú lỗi', 'Bắt buộc khi có lỗi trừ điểm; nên ghi ngắn gọn hiện trạng, vị trí và bằng chứng liên quan.'],
      ['Ảnh minh chứng', 'Chụp hoặc tải ảnh để chứng minh lỗi, nhất là lỗi trừ điểm, CCP hoặc lỗi cần Action Plan.'],
    ]),
    image(refresh + '07-qc-desktop-audit-execution-managed-criterion.png', 'Chấm tiêu chí cửa hàng quản lý', 'UI chấm từng tiêu chí cho cửa hàng quản lý: Pass, lỗi trừ điểm, số lỗi, lỗi lặp, ghi chú và ảnh minh chứng.'),
  ]),
  section('audit-execution-franchise-criteria', '7.4. Chấm tiêu chí cửa hàng nhượng quyền', 2, [
    ...audience('QC chấm tiêu chí cho cửa hàng nhượng quyền.'),
    p('Với cửa hàng nhượng quyền, flow mở bài và gửi bài giống cửa hàng quản lý, nhưng UI chấm từng tiêu chí được tối giản theo điểm trừ nhượng quyền. QC không nhập nhiều trạng thái như cửa hàng quản lý mà chủ yếu bật Có lỗi, Có lặp lại hoặc nhập số câu sai cho bài kiểm tra kiến thức.'),
    table(['Nhóm/field', 'Cách hiểu'], [
      ['Có lỗi', 'Bật khi tiêu chí nhượng quyền không đạt. Hệ thống tự tính điểm trừ theo nhóm lỗi của tiêu chí.'],
      ['Có lặp lại', 'Chỉ bật được khi đã bật Có lỗi; dùng khi lỗi tái diễn theo quy định.'],
      ['Ghi chú lỗi', 'Bắt buộc khi Có lỗi. Ghi rõ hiện trạng, khu vực và lý do đánh lỗi.'],
      ['Ghi chú cảnh báo', 'Nếu không bật Có lỗi, ghi chú chỉ là cảnh báo/quan sát 0 điểm.'],
      ['Số câu sai', 'Chỉ dùng cho bài thi kiểm tra kiến thức. QC nhập số câu sai trên tổng 10 câu, hệ thống tự quy đổi điểm trừ.'],
      ['Điểm hiện tại', 'Cho thấy điểm còn lại của tiêu chí sau khi bật lỗi/lặp hoặc nhập số câu sai.'],
    ]),
    image(refresh + '07-qc-desktop-audit-execution-franchise-criterion.png', 'Chấm tiêu chí nhượng quyền thường', 'UI tiêu chí nhượng quyền thường: bật Có lỗi, Có lặp lại và nhập ghi chú.'),
    image(refresh + '07-qc-desktop-audit-execution-franchise-knowledge-criterion.png', 'Chấm bài thi kiến thức nhượng quyền', 'UI bài kiểm tra kiến thức nhượng quyền: nhập số câu sai và xem điểm trừ tương ứng.'),
  ]),
  section('audit-execution-risk-ccp', '7.5. Risk/CCP nhóm và F-Risk/F-CCP', 2, [
    ...audience('QC ghi nhận Risk/CCP hoặc F-Risk/F-CCP khi lỗi đúng quy định QA/QC.'),
    p('QC chỉ dùng các đánh dấu nghiêm trọng khi lỗi đúng quy định QA/QC. Đây là nhóm thao tác ảnh hưởng lớn tới điểm tổng và cần ghi chú rõ ràng.'),
    table(['Nhãn trên hệ thống', 'Áp dụng cho', 'Ảnh hưởng điểm'], [
      ['Risk', 'Cửa hàng quản lý', 'Đưa điểm toàn bài về 0 khi xác nhận gửi bài.'],
      ['CCP nhóm', 'Cửa hàng quản lý', 'Áp dụng theo nhóm tiêu chí; hệ thống giữ trace lý do và bằng chứng.'],
      ['F-Risk', 'Cửa hàng nhượng quyền', 'Đưa điểm toàn bài về 0 khi xác nhận gửi bài.'],
      ['F-CCP', 'Cửa hàng nhượng quyền', 'Có thể chọn nhiều lý do F-CCP, nhưng toàn bài chỉ bị trừ 90 điểm một lần.'],
    ]),
    steps(['Bấm Risk/F-Risk hoặc CCP nhóm/F-CCP trên thanh tóm tắt.', 'Chọn đúng lý do nghiêm trọng.', 'Nhập ghi chú bắt buộc cho từng lý do đã chọn.', 'Thêm ảnh minh chứng nếu có.', 'Kiểm tra lại cảnh báo điểm trước khi gửi bài.']),
    image(refresh + '07-qc-desktop-audit-execution-franchise-fccp-reasons.png', 'Chọn lý do F-CCP', 'UI chọn lý do F-CCP cho cửa hàng nhượng quyền; nhiều lý do có thể được lưu nhưng điểm F-CCP chỉ trừ một lần.'),
  ]),
  section('audit-execution-save-submit', '7.6. Lưu nháp và gửi bài', 2, [
    ...audience('QC lưu nháp và gửi bài; QAM có thể chỉnh sửa bài đã nộp trước khi điểm được xác nhận.'),
    steps(['Kiểm tra lại tóm tắt phiên audit.', 'Bấm Lưu nháp nếu chưa hoàn tất hoặc cần quay lại sau.', 'Bấm Hoàn tất audit khi đã kiểm tra đủ tiêu chí, ghi chú và ảnh minh chứng.', 'Đọc màn xác nhận nộp bài, đặc biệt nếu có Risk/F-Risk hoặc F-CCP.', 'Xác nhận nộp bài để chuyển sang Kết quả audit.']),
    bullets(['Khi đã gửi bài, dữ liệu trở thành kết quả audit chính thức.', 'Nếu có lỗi trừ điểm thật sự, các bước xác nhận điểm và Action Plan sẽ tiếp tục theo nghiệp vụ hệ thống.', 'QAM chỉ chỉnh sửa được kết quả trước khi điểm được xác nhận; sau khi xác nhận, kết quả bị khóa chỉnh sửa.']),
  ]),

  section('audit-result', '8. Kết quả audit', 1, [
    ...audience('QAM/QC/SM/AM/OM/COO xem theo phạm vi quyền; QAM chỉnh sửa trước xác nhận; SM xác nhận điểm.'),
    p('Kết quả audit là nơi xem bài đã submit, chi tiết lỗi, điểm, ảnh minh chứng, trạng thái xác nhận điểm, trạng thái Action Plan và export dữ liệu.'),
  ]),
  section('audit-result-list', '8.1. Danh sách kết quả audit', 2, [
    ...audience('QAM/QC/SM/AM/OM/COO xem danh sách theo phạm vi quyền.'),
    steps(['Vào Kết quả audit.', 'Chọn khoảng thời gian, Brand, Checklist, Trạng thái, Trạng thái Action Plan, AM hoặc Cửa hàng nếu cần.', 'Bấm dòng kết quả để xem chi tiết.', 'Bấm Xuất Excel để tải dữ liệu theo filter hiện tại và phạm vi quyền.']),
    table(['Trường/bộ lọc', 'Ý nghĩa'], [
      ['Khoảng ngày', 'Lọc theo thời gian bài audit được nộp/mở trong kỳ.'],
      ['Brand', 'Lọc kết quả theo thương hiệu. OM chỉ thấy brand được phân công.'],
      ['Checklist', 'Lọc theo checklist quản lý hoặc nhượng quyền.'],
      ['Trạng thái', 'Theo dõi bài nháp/submitted/đã xử lý theo dữ liệu hiện hành.'],
      ['Action Plan', 'Lọc kết quả đã có, chưa có hoặc đang theo dõi Action Plan.'],
      ['AM/Cửa hàng', 'Dùng để drill-down theo người phụ trách hoặc store cụ thể.'],
    ]),
    image(refresh + '08-qam-desktop-audit-results-list.png', 'Danh sách kết quả audit', 'Danh sách kết quả audit có filter và export.'),
  ]),
  section('audit-result-detail', '8.2. Chi tiết kết quả audit', 2, [
    ...audience('QAM/QC/SM/AM/OM/COO xem chi tiết theo phạm vi quyền.'),
    label('Người dùng sẽ thấy gì'),
    bullets(['Header gồm cửa hàng, mã cửa hàng, trạng thái bài, điểm tổng, trạng thái xác nhận điểm và tag Risk/F-Risk nếu có.', 'Thông tin chung gồm người chấm, chức danh, checklist, thời gian mở/nộp bài, người xác nhận và thời gian xác nhận.', 'Bảng điểm theo nhóm hiển thị số tiêu chí, số lỗi, điểm trừ và tỷ trọng/điểm nhóm.', 'Danh sách lỗi hiển thị Risk/F-Risk, CCP/F-CCP, lỗi lặp, điểm trừ, ghi chú và ảnh minh chứng.']),
    image(refresh + '09-qam-desktop-audit-result-detail.png', 'Chi tiết kết quả audit', 'Chi tiết kết quả audit theo giao diện hiện tại.'),
  ]),
  section('audit-result-edit-export', '8.3. Chỉnh sửa kết quả và xuất Excel', 2, [
    ...audience('QAM chỉnh sửa kết quả trước khi điểm được xác nhận; các role có quyền xem kết quả xuất Excel theo phạm vi quyền.'),
    label('Chỉnh sửa kết quả'),
    p('Chức năng này dùng khi bài audit đã được nộp nhưng QAM cần điều chỉnh lại nội dung trước khi cửa hàng xác nhận điểm. Sau khi điểm đã được xác nhận, kết quả bị khóa để giữ tính toàn vẹn dữ liệu.'),
    steps(['Vào Kết quả audit và mở bài cần kiểm tra.', 'Nếu trạng thái điểm là Chưa xác nhận, QAM bấm Chỉnh sửa kết quả.', 'Hệ thống đưa QAM về màn chấm audit với dữ liệu đã nộp trước đó.', 'QAM điều chỉnh tiêu chí, số lỗi, lỗi lặp, ghi chú, ảnh minh chứng, Risk/F-Risk hoặc CCP/F-CCP nếu cần.', 'Bấm Lưu sửa đổi, nhập lý do chỉnh sửa và xác nhận lưu.']),
    table(['Trường hợp', 'Hệ thống xử lý'], [
      ['Kết quả chưa xác nhận điểm', 'QAM thấy nút Chỉnh sửa kết quả và có thể lưu sửa đổi.'],
      ['Kết quả đã xác nhận điểm', 'Không dùng để sửa điểm; người dùng chỉ xem lại kết quả, lỗi, ảnh minh chứng và lịch sử liên quan.'],
      ['Role có quyền xem kết quả', 'Xem theo phạm vi quyền được phân công. Thao tác sửa điểm sau khi nộp dành cho QAM trước bước xác nhận điểm.'],
    ]),
    image(refresh + '08-qam-desktop-audit-result-edit-entry.png', 'QAM mở chỉnh sửa kết quả', 'Chi tiết kết quả hiển thị nút Chỉnh sửa kết quả khi bài đã nộp nhưng chưa xác nhận điểm.'),
    image(refresh + '08-qam-desktop-audit-result-edit-mode.png', 'Màn chỉnh sửa kết quả đã nộp', 'QAM chỉnh lại bài audit đã nộp trên chính màn chấm audit, sau đó bấm Lưu sửa đổi.'),
    image(refresh + '08-qam-desktop-audit-result-edit-reason.png', 'Nhập lý do chỉnh sửa kết quả', 'QAM phải nhập lý do trước khi lưu thay đổi để hệ thống ghi nhận lịch sử chỉnh sửa.'),
    label('Xuất Excel'),
    p('Nút Xuất Excel dùng để tải file .xlsx theo bộ lọc đang chọn trên màn Kết quả audit và theo phạm vi quyền của người đăng nhập. File tập trung vào các lỗi/lý do cần theo dõi; mỗi dòng là một tiêu chí vi phạm hoặc một lý do CCP/F-CCP đã được chọn.'),
    steps(['Vào Kết quả audit.', 'Chọn khoảng ngày, Brand, Checklist, Trạng thái, Action Plan, AM hoặc Cửa hàng nếu cần.', 'Với các role xem nhiều cửa hàng, cần chọn Checklist để nút Xuất Excel khả dụng. SM xuất theo phạm vi cửa hàng của mình.', 'Bấm Xuất Excel và chờ thông báo tải file thành công.']),
    table(['Nội dung trong file', 'Giải thích'], [
      ['Phạm vi dữ liệu', 'Chỉ gồm kết quả phù hợp filter hiện tại và quyền xem dữ liệu của người đăng nhập.'],
      ['Tên file', 'Tên file theo dạng result + brand + checklist + khoảng ngày để dễ nhận biết kỳ xuất dữ liệu.'],
      ['Worksheet', 'Một worksheet tổng hợp để người dùng tiếp tục lọc/sắp xếp trong Excel.'],
      ['Dòng dữ liệu', 'Mỗi dòng là một lỗi tiêu chí, một lý do CCP nhóm hoặc một lý do F-CCP. Thông tin cửa hàng được lặp lại trên từng dòng để dễ lọc.'],
      ['Các cột chính', 'Tháng, Lần, Mã Cửa Hàng, Cửa Hàng, AM, Người chấm, Ngày Chấm, Kết quả, Nhóm, Mã tiêu chí, Hạng mục đánh giá, Tiêu chuẩn, Điểm trừ, Lỗi lặp, Mô tả lỗi.'],
      ['Điểm trừ/Lỗi lặp/Mô tả lỗi', 'Điểm trừ là số điểm bị trừ cho dòng lỗi; Lỗi lặp hiển thị khi có ghi nhận lặp; Mô tả lỗi lấy từ ghi chú hoặc nội dung lỗi đã chọn.'],
    ]),
    image(refresh + '08-qam-desktop-audit-results-export-excel.png', 'Xuất Excel kết quả audit', 'Danh sách Kết quả audit với filter hiện tại và nút Xuất Excel.'),
  ]),

  section('score-confirm-action-plan', '9. Xác nhận điểm và Action Plan', 1, [
    ...audience('SM xác nhận điểm và cập nhật Action Plan; QAM/AM/OM/COO theo dõi theo phạm vi quyền.'),
    p('Sau khi QC submit bài audit, SM kiểm tra và xác nhận điểm. Nếu SM không xác nhận trong 120 giờ, hệ thống tự xác nhận theo kết quả QC đã nộp. Action Plan chỉ được tạo từ lỗi trừ điểm thật sự sau khi điểm được xác nhận.'),
  ]),
  section('score-confirm', '9.1. SM xác nhận điểm và tự động xác nhận sau 120 giờ', 2, [
    ...audience('SM xác nhận điểm cho cửa hàng mình phụ trách; QAM/QA theo dõi trạng thái xác nhận.'),
    label('Cách hoạt động'),
    steps(['QC submit bài audit.', 'SM nhận thông báo nhắc xác nhận điểm.', 'SM mở kết quả audit và kiểm tra điểm, lỗi, ghi chú, ảnh minh chứng.', 'SM xác nhận điểm nếu kết quả đúng.', 'Nếu quá 120 giờ SM chưa xác nhận, hệ thống tự xác nhận bằng actor system:auto-confirm-120h.']),
    label('Mốc nhắc việc'),
    bullets(['Sau 96 giờ: hệ thống gửi thông báo nhắc SM xác nhận điểm.', 'Sau 119 giờ: hệ thống gửi nhắc lần cuối trước tự động xác nhận.', 'Sau 120 giờ: hệ thống tự xác nhận điểm nếu SM vẫn chưa thao tác.']),
    image(refresh + '09-sm-desktop-score-confirmation-list.png', 'SM xem kết quả chờ xác nhận', 'SM xem danh sách kết quả audit cần xác nhận điểm.'),
    image(refresh + '10-sm-desktop-score-notification-center.png', 'Thông báo xác nhận điểm của SM', 'Thông báo nhắc xác nhận điểm và tự động xác nhận sau 120 giờ.'),
  ]),
  section('action-plan-list', '9.2. Danh sách Action Plan', 2, [
    ...audience('SM xử lý Action Plan của cửa hàng; QAM/QA/AM/OM/COO theo dõi theo phạm vi quyền.'),
    label('Mục đích'),
    p('Danh sách Action Plan dùng để theo dõi các lỗi cần khắc phục sau audit. Hệ thống chỉ tạo Action Plan khi kết quả đã được xác nhận và có lỗi trừ điểm thật sự hoặc lỗi F-CCP/F-Risk/Risk phù hợp nghiệp vụ.'),
    bullets(['Ghi nhận không trừ điểm không tạo Action Plan.', 'Điểm bù cửa hàng chưa chấm không tạo Action Plan.', 'QA/QAM/OM/COO dùng Action Plan để theo dõi; SM cập nhật nguyên nhân, hành động, người phụ trách, ngày hoàn thành và minh chứng.']),
  ]),
  section('action-plan-detail', '9.3. Cập nhật và đóng Action Plan', 2, [
    ...audience('SM cập nhật nguyên nhân, hành động và minh chứng; QAM/QA/AM/OM/COO kiểm tra tiến độ.'),
    steps(['Mở một Action Plan từ danh sách hoặc từ thông báo.', 'Đọc thông tin chung: cửa hàng, checklist, điểm tổng, số vi phạm, hạn xử lý và tiến độ.', 'SM cập nhật nguyên nhân không đạt, hành động khắc phục, người thực hiện, ngày hoàn thành và ảnh minh chứng.', 'Khi các dòng đã đủ thông tin, SM đóng Action Plan theo quyền.']),
    bullets(['QA thường dùng màn chi tiết để kiểm tra tiến độ và nội dung xử lý.', 'Một dòng Action Plan chỉ được xem là đủ thông tin khi có nguyên nhân, hành động, người thực hiện, ngày hoàn thành và minh chứng.', 'Các thông báo Action Plan mở trực tiếp vào chi tiết Action Plan liên quan.']),
    image(refresh + '09-qam-desktop-action-plan-detail.png', 'Chi tiết Action Plan', 'Chi tiết Action Plan theo giao diện hiện tại.'),
  ]),

  section('thong-bao', '10. Thông báo và điều hướng', 1, [
    ...audience('Tất cả role. Nội dung thông báo phụ thuộc quyền và phạm vi dữ liệu của role đang đăng nhập.'),
    p('Thông báo giúp người dùng biết việc cần xử lý mà không phải tự kiểm tra từng màn. Người dùng bấm biểu tượng chuông trên header để xem việc mới, sau đó bấm vào từng thông báo để đi tới màn liên quan nếu thông báo có liên kết.'),
  ]),
  section('notification-center', '10.1. Mở trung tâm thông báo', 2, [
    ...audience('Tất cả role dùng để xem việc mới và đi nhanh tới màn liên quan.'),
    steps(['Bấm biểu tượng chuông trên header.', 'Đọc danh sách thông báo mới.', 'Bấm Đọc tất cả nếu muốn đánh dấu toàn bộ là đã đọc.', 'Bấm một thông báo để mở đúng màn liên quan, ví dụ kết quả audit, kế hoạch audit hoặc Action Plan.']),
    bullets(['Thông báo chưa đọc có chấm xanh và badge số lượng trên chuông.', 'Mỗi thông báo hiển thị tiêu đề, nội dung ngắn và thời gian phát sinh.', 'Người dùng có thể ẩn từng thông báo bằng nút đóng ở cạnh phải.']),
    image(refresh + '10-qam-desktop-notification-center.png', 'Trung tâm thông báo', 'Trung tâm thông báo trên dashboard.'),
  ]),
  section('notification-types', '10.2. Các loại thông báo thường gặp', 2, [
    ...audience('Tất cả role đọc để hiểu loại thông báo nào thường gửi tới mình.'),
    table(['Loại thông báo', 'Ai thường nhận', 'Màn được mở khi bấm vào'], [
      ['audit-plan-published', 'QC/AM/SM trong phạm vi kế hoạch', 'Kế hoạch audit hoặc Thực hiện audit.'],
      ['audit-session-submitted', 'QAM/QA owner và SM liên quan', 'Kết quả audit, có thể focus đúng session.'],
      ['audit-score-confirmation-reminder', 'SM', 'Kết quả audit cần xác nhận điểm.'],
      ['audit-score-auto-confirmed', 'SM', 'Kết quả audit đã được hệ thống xác nhận sau 120 giờ.'],
      ['audit-score-confirmed', 'Plan owner/QAM', 'Kết quả audit đã được SM xác nhận.'],
      ['action-plan-created', 'SM/QA theo phạm vi', 'Chi tiết Action Plan mới.'],
      ['action-plan-due-soon / action-plan-overdue', 'SM/QA theo phạm vi', 'Chi tiết Action Plan cần xử lý.'],
      ['audit-overdue-reminder', 'QC/QA theo phân công', 'Thực hiện audit hoặc kế hoạch audit bị trễ.'],
    ]),
    label('Lưu ý'),
    bullets(['Deep link có thể mở danh sách và highlight đúng dòng nếu thông báo trỏ tới một session cụ thể.', 'Nếu người dùng không thấy dữ liệu sau khi bấm thông báo, kiểm tra role đang xem và filter ở màn đích.', 'Dữ liệu thông báo vẫn tuân theo phạm vi quyền của role đăng nhập.']),
  ]),

  section('faq', '11. Câu hỏi thường gặp', 1, [
    ...audience('Tất cả người dùng.'),
    p('Phần này gom các tình huống người dùng hay gặp khi thao tác QA/QC. Nội dung tập trung vào cách tự kiểm tra nhanh trước khi báo lỗi hoặc nhờ Admin/QA hỗ trợ.'),
  ]),
  section('faq-common', '11.1. Kiểm tra nhanh khi dữ liệu chưa đúng', 2, [
    ...audience('Tất cả người dùng khi cần tự kiểm tra dữ liệu hoặc filter.'),
    table(['Câu hỏi', 'Cách xử lý'], [
      ['Dashboard không có dữ liệu', 'Kiểm tra khoảng ngày, checklist, brand, cửa hàng, loại cửa hàng và phạm vi quyền của role đang xem.'],
      ['OM không thấy đủ cửa hàng', 'OM chỉ thấy dữ liệu thuộc brand được phân công. Kiểm tra role assignment scopeType brand và scopeIds brand.'],
      ['COO xem dữ liệu theo phạm vi nào?', 'COO là vai trò quản lý tất cả brand; khi role COO được cấp, dashboard/báo cáo cần đọc theo phạm vi all-brand.'],
      ['Không thấy cửa hàng trong filter', 'Chọn Brand sẽ lọc cửa hàng theo brand; kiểm tra dữ liệu nền cửa hàng, trạng thái và loại cửa hàng.'],
      ['Checklist nhượng quyền có cần preset không?', 'Có. Khi checklist áp dụng cho Cửa hàng nhượng quyền, hệ thống dùng Điểm trừ cố định và 5 nhóm preset nhượng quyền để tính F-CCP/F-Risk đúng quy định.'],
      ['Ghi nhận không trừ điểm có tính lỗi không?', 'Không. Đây là note/quan sát, không trừ điểm, không tính lỗi và không tạo Action Plan.'],
      ['Bù điểm có tạo Action Plan không?', 'Không. Bù điểm chỉ để đủ thống kê, không có lỗi chi tiết tháng hiện tại.'],
      ['Export Excel lấy dữ liệu nào?', 'Theo filter hiện tại và phạm vi quyền của role.'],
    ]),
  ]),
  section('faq-permission-workflow', '11.2. Quyền thao tác và luồng xử lý', 2, [
    ...audience('Tất cả người dùng khi cần hiểu quyền thao tác và luồng xử lý theo role.'),
    table(['Tình huống', 'Cách hiểu đúng'], [
      ['Không thấy nút xác nhận điểm', 'Chỉ SM trong phạm vi cửa hàng liên quan mới xác nhận điểm. Nếu bài đã xác nhận hoặc đã tự xác nhận, nút sẽ không còn cần hiển thị.'],
      ['Bao lâu thì hệ thống tự xác nhận điểm?', 'Sau 120 giờ kể từ thời điểm bài audit cần xác nhận mà SM chưa thao tác; hệ thống có nhắc ở mốc 96 giờ và 119 giờ.'],
      ['QAM có chỉnh sửa kết quả sau khi SM xác nhận không?', 'Không. QAM chỉ chỉnh sửa trước khi điểm được xác nhận; sau khi xác nhận kết quả bị khóa.'],
      ['Audit quản lý và nhượng quyền khác flow không?', 'Flow thao tác giống nhau; khác ở cơ chế tính điểm, preset nhóm, Risk/CCP so với F-Risk/F-CCP.'],
      ['F-CCP chọn nhiều lý do có trừ nhiều lần không?', 'Không. Hệ thống chỉ trừ 90 điểm một lần trong bài audit, nhưng vẫn lưu từng lý do và ghi chú để trace.'],
      ['Không thấy nút cập nhật Action Plan', 'QA/QAM/OM thường xem và theo dõi; SM là người cập nhật nguyên nhân, hành động, người thực hiện, ngày hoàn thành và minh chứng trong phạm vi cửa hàng.'],
      ['Thông báo bấm vào nhưng không mở đúng dòng mong muốn', 'Kiểm tra role hiện tại và filter trên màn đích. Một số thông báo mở danh sách và highlight dòng liên quan.'],
    ]),
  ]),
];

const imageCount = sections.flatMap((item) => item.blocks).filter((block) => block.type === 'image').length;
const publicRoot = path.join(projectRoot, 'public');
const missing = sections
  .flatMap((item) => item.blocks)
  .filter(
    (block) =>
      block.type === 'image' &&
      !fs.existsSync(path.join(publicRoot, block.src.replace(/^\//, ''))),
  )
  .map((block) => block.src);

if (missing.length > 0) {
  console.error('Missing guide images:', missing);
  process.exit(1);
}

const guide = {
  title: 'Hướng dẫn sử dụng hệ thống QA/QC Maycha',
  version: 'Bản cập nhật 07/07/2026',
  scope: 'Hướng dẫn đầy đủ thao tác hệ thống QA/QC: dashboard, dữ liệu nền, checklist, audit plan, audit execution, audit result, Action Plan, notification và FAQ; cập nhật role OM/COO, nhượng quyền và xác nhận điểm 120 giờ',
  audience: 'Admin/QA, AM, QC, SM và người vận hành QA/QC',
  notice: 'Bản web này thay thế nội dung guide cũ làm bản tra cứu chính. File Word được tạo từ cùng nội dung với bản web.',
  sourceDocument: '/downloads/huong-dan-su-dung-he-thong-qaqc-maycha-01-06-2026.docx',
  imageCount,
  sections,
};

fs.writeFileSync(
  path.join(projectRoot, 'src/content/guide-content.json'),
  `${JSON.stringify(guide, null, 2)}\n`,
  'utf8',
);

console.log(JSON.stringify({ sections: sections.length, imageCount }, null, 2));

