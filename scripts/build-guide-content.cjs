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
const old = (number) => `/assets/user-guide/figure-${String(number).padStart(3, '0')}.png`;

const p = (text) => ({ type: 'paragraph', text });
const label = (text) => ({ type: 'label', text });
const steps = (items) => ({ type: 'steps', items });
const bullets = (items) => ({ type: 'bullets', items });
const table = (headers, rows) => ({ type: 'table', headers, rows });
const image = (src, alt, caption) => ({ type: 'image', src, alt, caption });
const section = (id, title, level, blocks) => ({ id, title, level, blocks });

const sections = [
  section('tong-quan', '1. Tổng quan hệ thống', 1, [
    p('Tài liệu này là bản hướng dẫn web đầy đủ cho hệ thống QA/QC Maycha. Nội dung kế thừa bản guide cũ và bổ sung các flow mới: dashboard 5 role, filter chọn nhiều, export Excel, audit 0 điểm, tự động xác nhận sau 48 giờ và bù điểm cho cửa hàng chưa được chấm.'),
    table(['Vai trò', 'Mục tiêu chính', 'Màn hình thường dùng'], [
      ['Admin / Executive / Company Admin', 'Quản trị dữ liệu nền và xem dashboard điều hành', 'Dashboard, Thương hiệu, Cửa hàng, Địa bàn, Người dùng'],
      ['QA Manager', 'Điều phối QA/QC, quản lý checklist, audit plan, kết quả và Action Plan', 'Dashboard, Tiêu chí, Checklist, Kế hoạch audit, Kết quả audit, Action Plan'],
      ['QC audit', 'Nhận bài audit và thực hiện chấm điểm', 'Dashboard QC, Thực hiện audit, Kết quả audit'],
      ['SM', 'Theo dõi cửa hàng, xác nhận điểm và xử lý Action Plan', 'Dashboard SM, Kết quả audit, Action Plan, Thông báo'],
      ['AM', 'Theo dõi các cửa hàng mình phụ trách', 'Dashboard AM, Kết quả audit, Action Plan'],
    ]),
    label('Luồng vận hành tổng quát'),
    steps([
      'Admin/QA chuẩn bị dữ liệu nền: brand, cửa hàng, người dùng, tiêu chí, checklist.',
      'QA tạo và phát hành kế hoạch audit.',
      'QC nhận bài, kiểm tra cửa hàng, lưu nháp hoặc submit bài audit.',
      'SM xác nhận điểm; nếu quá 48 giờ chưa xác nhận, hệ thống tự xác nhận.',
      'Nếu có lỗi thật sự, Action Plan được tạo hoặc theo dõi để xử lý.',
      'Dashboard và kết quả audit cập nhật theo dữ liệu đã submit hoặc điểm bù cuối kỳ.',
    ]),
  ]),

  section('dang-nhap', '2. Đăng nhập và tài khoản', 1, [
    p('Người dùng cần đăng nhập đúng tài khoản và đúng vai trò để hệ thống hiển thị đúng menu, dữ liệu và quyền thao tác.'),
  ]),
  section('dang-nhap-1', '2.1. Đăng nhập', 2, [
    label('Mục đích'),
    p('Đăng nhập vào hệ thống bằng email và mật khẩu được cấp.'),
    label('Cách thao tác'),
    steps(['Mở đường dẫn hệ thống QA/QC.', 'Nhập email.', 'Nhập mật khẩu.', 'Bấm Đăng nhập.']),
    label('Người dùng sẽ thấy gì'),
    bullets(['Nếu đúng tài khoản, hệ thống mở dashboard theo vai trò.', 'Nếu sai tài khoản hoặc mật khẩu, hệ thống báo không thể đăng nhập.']),
    image(full + '00-login-page.png', 'Màn hình đăng nhập', 'Màn hình đăng nhập hiện tại.'),
  ]),
  section('dang-nhap-2', '2.2. Đổi mật khẩu lần đầu hoặc đổi mật khẩu tài khoản', 2, [
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
    p('Dashboard là nơi xem nhanh tình hình QA/QC. Mỗi vai trò nhìn thấy dashboard khác nhau theo phạm vi quyền và dữ liệu được phân công.'),
    label('Cách đọc chung'),
    p('Người dùng nên bắt đầu bằng việc chọn khoảng Từ ngày - Đến ngày, sau đó lọc tiếp theo Thương hiệu, AM, Cửa hàng, Loại cửa hàng và Loại checklist nếu màn hình có hiển thị các filter này.'),
    p('Các dropdown trên dashboard có thể chọn nhiều giá trị. Khi chọn thương hiệu, danh sách cửa hàng chỉ còn các cửa hàng thuộc thương hiệu đã chọn. Khi đổi loại cửa hàng, checklist sẽ quay về trạng thái tất cả checklist thuộc loại cửa hàng mới.'),
    p('Dashboard đang thống kê theo checklist thay vì kiểu điểm, vì mỗi checklist có thể có thang điểm và hệ quy chiếu khác nhau. Cách này giúp so sánh dữ liệu đúng hơn khi người dùng lọc báo cáo.'),
  ]),
  section('dashboard-admin', '3.1. Dashboard Admin', 2, [
    label('Mục đích'),
    p('Dashboard Admin dùng để xem toàn cảnh chất lượng QA/QC của toàn công ty.'),
    p('Màn hình hiển thị các chỉ số tổng quan như điểm trung bình, số cửa hàng đã chấm, tổng lỗi, Risk/CCP và lỗi lặp lại trong kỳ đang lọc.'),
    p('Admin có thể theo dõi tiến độ audit plan, chất lượng cửa hàng, phân tích lỗi theo nhóm, xu hướng điểm trung bình, các vấn đề trọng yếu, top cửa hàng lỗi nhiều và top tiêu chí bị đánh lỗi nhiều nhất.'),
    p('Dashboard này phù hợp khi cần xem nhanh tình hình vận hành toàn hệ thống, phát hiện khu vực/cửa hàng rủi ro và quyết định nơi cần ưu tiên kiểm tra sâu hơn.'),
    image(full + '01-admin-dashboard-01.png', 'Dashboard Admin', 'Dashboard của Admin'),
  ]),
  section('dashboard-qam', '3.2. Dashboard QA', 2, [
    label('Mục đích'),
    p('Dashboard QA dùng để theo dõi nhịp vận hành QA/QC trong phạm vi QA được giao.'),
    p('Màn hình giúp QA kiểm tra nhanh điểm trung bình, cửa hàng đã chấm, tổng lỗi, Risk/CCP, lỗi lặp lại và tiến độ audit plan trong kỳ.'),
    p('QA có thể dùng dashboard để tìm cửa hàng điểm thấp, nhóm lỗi nổi bật, tiêu chí bị lỗi nhiều, các vấn đề trọng yếu và danh sách rủi ro cần theo dõi.'),
    p('Khi phát hiện bất thường, QA có thể đi tiếp sang Kế hoạch audit, Kết quả audit hoặc Action Plan để xem chi tiết và xử lý đúng luồng.'),
    image(full + '10-qam-dashboard-01.png', 'Dashboard QA', 'Dashboard của QA'),
  ]),
  section('dashboard-am', '3.3. Dashboard AM', 2, [
    label('Mục đích'),
    p('Dashboard AM dùng để theo dõi chất lượng các cửa hàng thuộc phạm vi AM phụ trách.'),
    p('Màn hình có cùng cấu trúc phân tích với dashboard QA nhưng dữ liệu được giới hạn theo các cửa hàng AM được phân công.'),
    p('AM có thể xem điểm trung bình, cửa hàng đã chấm, tổng lỗi, Risk/CCP, lỗi lặp lại, xu hướng điểm và các cửa hàng có nhiều vấn đề nhất trong kỳ.'),
    p('Dashboard này giúp AM ưu tiên hỗ trợ cửa hàng, theo dõi chất lượng vận hành và phối hợp với QA/SM khi có Action Plan hoặc lỗi nghiêm trọng cần xử lý.'),
    image(upd + 'dashboard-am-verified-overview.png', 'Dashboard AM', 'Dashboard của AM'),
  ]),
  section('dashboard-qc', '3.4. Dashboard QC', 2, [
    label('Mục đích'),
    p('Dashboard QC dùng để QC theo dõi công việc cá nhân và các bài audit được giao.'),
    p('Màn hình hiển thị số việc được giao, số bài chưa chấm, đang chấm, đã submit và tổng lỗi/Risk đã ghi nhận trong các bài audit.'),
    p('QC có thể xem danh sách store được giao, tiến độ chấm theo kế hoạch, hiệu suất cá nhân và biểu đồ điểm các bài đã submit.'),
    p('Chỉ số trung bình submit/ngày được tính theo ngày có audit, không chia đều cho toàn bộ ngày trong kỳ. Bài đang chấm chỉ là tiến độ, chưa được tính như kết quả cuối cùng.'),
    image(upd + 'dashboard-qc-verified-overview.png', 'Dashboard QC', 'Dashboard của QC'),
  ]),
  section('dashboard-sm', '3.5. Dashboard SM', 2, [
    label('Mục đích'),
    p('Dashboard SM dùng để Store Manager theo dõi chất lượng cửa hàng mình phụ trách.'),
    p('Màn hình hiển thị điểm gần nhất, điểm trung bình trong kỳ, số Action Plan đang mở, Action Plan quá hạn và tiến độ minh chứng khắc phục.'),
    p('SM có thể xem lịch sử audit của cửa hàng, các lỗi nghiêm trọng/Risk/CCP, xu hướng điểm theo thời gian và danh sách Action Plan cần cập nhật.'),
    p('Trên mobile, dashboard được tối ưu để SM kiểm tra nhanh tình trạng cửa hàng và xử lý Action Plan khi đang vận hành tại cửa hàng.'),
    image(upd + 'dashboard-sm-verified-overview.png', 'Dashboard SM desktop', 'Dashboard của SM'),
    image(upd + 'sm-mobile-dashboard-top-with-action-plan.png', 'Dashboard SM mobile', 'Dashboard SM trên mobile'),
  ]),

  section('du-lieu-nen', '4. Thiết lập dữ liệu nền', 1, [
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
    p('Tiêu chí và checklist là nền tảng của bài audit. QA/Admin cần quản lý đúng để QC chấm đúng và dashboard thống kê đúng.'),
  ]),
  section('tieu-chi', '5.1. Danh sách tiêu chí', 2, [
    label('Mục đích'),
    p('Quản lý các tiêu chí được dùng trong checklist audit.'),
    image(full + '12-qam-criteria-list.png', 'Danh sách tiêu chí mới', 'Danh sách tiêu chí hiện tại.'),
    image(old(38), 'Danh sách tiêu chí cũ', 'Ảnh thao tác tiêu chí từ guide cũ.'),
  ]),
  section('tieu-chi-chi-tiet', '5.2. Tạo và chỉnh sửa tiêu chí', 2, [
    label('Cách thao tác'),
    steps(['Mở danh sách tiêu chí.', 'Tạo mới hoặc mở tiêu chí cần chỉnh.', 'Cập nhật nhóm lỗi, loại lỗi, điểm trừ, Risk/CCP nếu có.', 'Lưu thay đổi.']),
    image(old(39), 'Form tiêu chí', 'Form tạo/chỉnh tiêu chí.'),
  ]),
  section('checklist-list', '5.3. Danh sách checklist', 2, [
    label('Mục đích'),
    p('Checklist gom nhiều tiêu chí và quyết định thang điểm, loại cửa hàng, bộ câu hỏi QC sẽ chấm.'),
    image(full + '13-qam-checklist-list.png', 'Danh sách checklist mới', 'Danh sách checklist hiện tại.'),
    image(full + '14-qam-checklist-detail.png', 'Chi tiết checklist mới', 'Chi tiết checklist hiện tại.'),
  ]),
  section('checklist-cau-hinh', '5.4. Cấu hình checklist', 2, [
    label('Lưu ý nghiệp vụ'),
    bullets(['Checklist quản lý và nhượng quyền có thể khác thang điểm.', 'Không dùng filter kiểu điểm chung cho nhiều checklist khác hệ quy chiếu.', 'Khi đổi loại cửa hàng trong dashboard/audit plan, checklist cần lấy đúng loại cửa hàng đó.']),
    image(old(44), 'Cấu hình checklist 1', 'Cấu hình checklist.'),
    image(old(48), 'Cấu hình checklist 2', 'Hoàn tất checklist.'),
  ]),

  section('audit-plan', '6. Kế hoạch audit', 1, [
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
    label('Mục đích'),
    p('Màn danh sách giúp QA theo dõi toàn bộ kế hoạch audit, nhận biết nhanh số kế hoạch đang mở, số cửa hàng đã được gán, số kế hoạch nháp và tổng số kế hoạch.'),
    label('Cách thao tác'),
    steps(['Vào Vận hành QA/QC > Kế hoạch audit.', 'Dùng ô tìm kiếm hoặc bộ lọc trạng thái để tìm kế hoạch cần xử lý.', 'Kiểm tra tên kế hoạch, kỳ audit, checklist, số cửa hàng và trạng thái.', 'Bấm Mở để xem chi tiết hoặc Sao chép để tạo một kế hoạch mới dựa trên kế hoạch hiện có.', 'Bấm Tạo kế hoạch audit khi cần bắt đầu một kỳ audit mới.']),
    label('Lưu ý'),
    bullets(['Trạng thái kế hoạch được hiển thị trực tiếp trên từng dòng.', 'Số cửa hàng cho biết phạm vi hiện tại của kế hoạch.', 'Sao chép tạo kế hoạch mới để tiếp tục chỉnh sửa, không sửa trực tiếp kế hoạch gốc.']),
    image(auditPlanGuide + '01-audit-plans-list.png', 'Danh sách kế hoạch audit', 'Danh sách kế hoạch audit và các chỉ số tổng quan.'),
  ]),
  section('audit-plan-create-draft', '6.2. Tạo kế hoạch nháp', 2, [
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
    label('Phát hành kế hoạch'),
    steps(['Kiểm tra kế hoạch đã có ít nhất một cửa hàng.', 'Kiểm tra mọi cửa hàng đều có QC Audit.', 'Bấm Phát hành kế hoạch.', 'Đọc nội dung xác nhận rồi bấm Phát hành.']),
    p('Sau khi phát hành, trạng thái kế hoạch chuyển từ Nháp sang Đang mở và bài audit được giao cho QC. Trong khi kế hoạch đang mở, QA vẫn có thể bổ sung cửa hàng hoặc thay QC đối với các cửa hàng chưa bắt đầu audit.'),
    label('Theo dõi tiến độ'),
    bullets(['Theo dõi trạng thái từng cửa hàng: Chưa chấm, Đang chấm, Đã hoàn thành hoặc Đã bù điểm.', 'Kiểm tra QC Audit để biết người đang chịu trách nhiệm.', 'Dùng Cửa hàng chưa có điểm vào cuối kỳ khi cần xử lý các cửa hàng chưa được chấm.']),
    image(auditPlanGuide + '08-publish-audit-plan-confirm.png', 'Xác nhận phát hành kế hoạch', 'Xác nhận trước khi phát hành kế hoạch audit.'),
    image(auditPlanGuide + '09-open-audit-plan-detail.png', 'Kế hoạch audit đang mở', 'Chi tiết kế hoạch sau khi phát hành.'),
  ]),
  section('audit-plan-bu-diem', '6.5. Bù điểm cửa hàng chưa được chấm', 2, [
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
    label('Mục đích'),
    p('Đóng kế hoạch khi kỳ audit đã kết thúc và QA đã kiểm tra xong tiến độ, kết quả và các điểm bù cần thiết.'),
    label('Cách thao tác'),
    steps(['Mở kế hoạch đang ở trạng thái Đang mở.', 'Kiểm tra lần cuối trạng thái của các cửa hàng.', 'Bấm Đóng kế hoạch.', 'Đọc cảnh báo và bấm Đóng kế hoạch để xác nhận.']),
    label('Lưu ý'),
    bullets(['Sau khi đóng, kế hoạch chuyển sang trạng thái Đã đóng và chỉ còn dùng để tra cứu.', 'Không thể thêm cửa hàng, thay QC hoặc bù điểm trên kế hoạch đã đóng.', 'Nên xử lý cửa hàng chưa có điểm trước khi đóng kế hoạch.']),
    image(auditPlanGuide + '14-close-audit-plan-confirm.png', 'Xác nhận đóng kế hoạch', 'Xác nhận trước khi đóng kế hoạch audit.'),
    image(auditPlanGuide + '15-closed-audit-plan-detail.png', 'Kế hoạch audit đã đóng', 'Chi tiết kế hoạch sau khi chuyển sang trạng thái Đã đóng.'),
  ]),

  section('audit-execution', '7. QC thực hiện audit trên mobile', 1, [
    p('QC thực hiện audit chủ yếu trên mobile. Luồng bắt đầu từ danh sách store được giao trong kế hoạch audit đang mở, sau đó QC mở từng bài, kiểm tra tiêu chí, ghi nhận lỗi hoặc ghi chú không trừ điểm, lưu nháp và gửi bài.'),
    label('Luồng thao tác khuyến nghị'),
    steps(['Đăng nhập bằng tài khoản QC và chọn role QC Audit nếu tài khoản có nhiều role.', 'Vào Vận hành QA/QC > Thực hiện audit.', 'Lọc trạng thái Chờ, Đang làm hoặc Xong để tìm đúng bài.', 'Mở bài audit của cửa hàng cần chấm.', 'Kiểm tra thông tin phiên, điểm tóm tắt và danh sách tiêu chí.', 'Chấm từng tiêu chí, thêm ghi chú hoặc ảnh minh chứng nếu cần.', 'Dùng Đánh Risk hoặc CCP nhóm khi phát sinh lỗi nghiêm trọng theo nghiệp vụ.', 'Lưu nháp khi chưa hoàn tất hoặc gửi bài khi đã kiểm tra xong.']),
  ]),
  section('audit-execution-list', '7.1. Danh sách bài audit được giao', 2, [
    label('Mục đích'),
    p('Màn Thực hiện audit là lịch làm việc của QC. Chỉ các store được gán cho QC trong kế hoạch audit đang mở mới xuất hiện ở đây.'),
    label('Cách thao tác'),
    steps(['Mở Thực hiện audit trên mobile.', 'Chọn tab Tất cả, Chờ, Đang làm hoặc Xong.', 'Mở phần Chi tiết cửa hàng nếu cần xem checklist, địa chỉ và thông tin phụ.', 'Bấm Bắt đầu với bài chưa thực hiện hoặc Xem lại với bài đã hoàn thành.']),
    label('Người dùng sẽ thấy gì'),
    bullets(['Mỗi thẻ hiển thị mã cửa hàng, tên cửa hàng, kế hoạch audit, trạng thái bài và loại cửa hàng.', 'Tab Chờ giúp QC tập trung vào các bài cần chấm mới.', 'Bài đã hoàn thành không dùng để chấm tiếp, chỉ dùng để xem lại.']),
    image(auditExecutionGuide + '01-qc-mobile-audit-execution-list.png', 'Danh sách bài audit QC trên mobile', 'Danh sách bài audit được giao cho QC trên mobile.'),
  ]),
  section('audit-execution-session', '7.2. Mở phiên audit', 2, [
    label('Mục đích'),
    p('Phiên audit là màn làm việc chính của QC tại cửa hàng. Màn này hiển thị thông tin kế hoạch, tóm tắt điểm/lỗi hiện tại, các nút xử lý Risk/CCP nhóm và danh sách tiêu chí audit.'),
    label('Cách thao tác'),
    steps(['Từ danh sách bài audit, bấm Bắt đầu.', 'Kiểm tra tên cửa hàng, kỳ audit, checklist và trạng thái bài.', 'Xem Tóm tắt phiên audit để biết số mục vi phạm, lỗi lặp, CCP và Risk hiện tại.', 'Dùng Lưu nháp để lưu tiến độ; dùng Gửi bài khi đã hoàn tất.', 'Mở Danh sách tiêu chí audit để bắt đầu chấm từng nhóm tiêu chí.']),
    label('Lưu ý'),
    bullets(['Nút Đánh Risk dùng cho lỗi nghiêm trọng làm bài audit về 0 điểm theo nghiệp vụ Risk.', 'Nút CCP nhóm dùng khi một nhóm tiêu chí áp dụng CCP nhóm.', 'Nếu chưa chắc dữ liệu đã đủ, QC nên Lưu nháp thay vì gửi bài ngay.']),
    image(auditExecutionGuide + '02-qc-mobile-audit-session-top.png', 'Phiên audit trên mobile', 'Màn phiên audit và tóm tắt bài chấm trên mobile.'),
    image(auditExecutionGuide + '03-qc-mobile-criteria-group-collapsed.png', 'Danh sách tiêu chí audit', 'Nhóm tiêu chí trước khi mở chi tiết.'),
  ]),
  section('audit-execution-criteria', '7.3. Chấm tiêu chí audit', 2, [
    label('Mục đích'),
    p('QC mở từng nhóm tiêu chí, chọn tiêu chí cần kiểm tra và cập nhật trạng thái theo thực tế tại cửa hàng.'),
    label('Cách thao tác'),
    steps(['Tại Danh sách tiêu chí audit, bấm Xem thêm ở nhóm tiêu chí.', 'Bấm Đánh giá ở tiêu chí cần chấm.', 'Giữ Pass nếu tiêu chí đạt.', 'Bấm Lỗi trừ điểm nếu có lỗi cần trừ điểm hoặc cần ghi nhận quan sát.', 'Nhập số lỗi, lỗi lặp, ghi chú và ảnh minh chứng nếu cần.', 'Bấm Xong để quay lại danh sách tiêu chí.']),
    label('Người dùng sẽ thấy gì'),
    bullets(['Mỗi tiêu chí có mã tiêu chí, tên tiêu chí, trạng thái Pass/Không trừ điểm/Lỗi/CCP, số ảnh và lỗi lặp.', 'Popup đánh giá tiêu chí có nút Pass, Lỗi trừ điểm, công tắc CCP, vùng ghi chú và khu vực ảnh minh chứng.', 'Có thể chuyển Tiêu chí trước / Tiêu chí tiếp để thao tác nhanh trên mobile.']),
    image(auditExecutionGuide + '04-qc-mobile-criteria-group-expanded.png', 'Nhóm tiêu chí đã mở', 'Danh sách tiêu chí trong một nhóm audit.'),
    image(auditExecutionGuide + '05-qc-mobile-criterion-drawer-pass.png', 'Popup đánh giá tiêu chí', 'Popup đánh giá một tiêu chí ở trạng thái Pass mặc định.'),
  ]),
  section('audit-zero-point', '7.4. Ghi nhận không trừ điểm', 2, [
    label('Mục đích'),
    p('QC có thể ghi nhận quan sát hoặc nhận xét mà không trừ điểm. Đây là trường hợp không tính lỗi, không trừ điểm tổng và không tạo Action Plan.'),
    label('Cách thao tác'),
    steps(['Mở tiêu chí cần ghi nhận.', 'Bấm Lỗi trừ điểm để mở form ghi nhận.', 'Để số lỗi ghi nhận bằng 0.', 'Nhập ghi chú ghi nhận hoặc gắn ảnh minh chứng nếu cần.', 'Hệ thống tự chuyển tiêu chí sang trạng thái Không trừ điểm / Không tính lỗi / Không bị trừ điểm.', 'Bấm Xong để quay lại danh sách tiêu chí.']),
    label('Lưu ý nghiệp vụ'),
    bullets(['Bắt buộc có ghi chú hoặc ảnh nếu muốn lưu ghi nhận không trừ điểm.', 'Không tính vào tổng lỗi/vi phạm.', 'Không làm giảm điểm tổng.', 'Không bật CCP/lỗi lặp và không tạo Action Plan.', 'Trong danh sách tiêu chí, mục này hiển thị là Không trừ điểm để QC biết đã có ghi nhận.']),
    image(auditExecutionGuide + '06-qc-mobile-zero-point-note.png', 'Ghi nhận không trừ điểm', 'QC nhập ghi chú cho trường hợp không trừ điểm.'),
    image(auditExecutionGuide + '07-qc-mobile-zero-point-in-list.png', 'Tiêu chí không trừ điểm trong danh sách', 'Tiêu chí hiển thị trạng thái Không trừ điểm sau khi ghi nhận.'),
  ]),
  section('audit-execution-risk-ccp', '7.5. Đánh Risk và CCP nhóm', 2, [
    label('Đánh Risk'),
    p('Risk dùng cho vi phạm nghiêm trọng làm ảnh hưởng trực tiếp đến kết quả bài audit theo quy định QA/QC. Khi QC chọn Risk, bài audit cần được kiểm tra kỹ vì điểm tổng có thể bị đưa về 0 theo nghiệp vụ Risk.'),
    steps(['Tại phiên audit, bấm Đánh Risk.', 'Chọn một hoặc nhiều lý do Risk phù hợp.', 'Nhập ghi chú hoặc gắn ảnh minh chứng cho lý do Risk nếu cần.', 'Bấm Xác nhận Risk để áp dụng vào bài audit.', 'Kiểm tra lại tóm tắt phiên audit trước khi gửi bài.']),
    label('CCP nhóm'),
    p('CCP nhóm dùng khi lỗi thuộc cấp nhóm tiêu chí. Khi áp dụng CCP nhóm, toàn bộ nhóm liên quan có thể bị tính 0 điểm nhưng hệ thống vẫn giữ trace lý do, số lỗi và bằng chứng để đối chiếu.'),
    steps(['Tại phiên audit, bấm CCP nhóm.', 'Chọn nhóm cần đánh, ví dụ Vệ sinh hoặc Thiết bị.', 'Tìm và chọn lý do CCP nhóm phù hợp.', 'Bấm Áp dụng để ghi nhận CCP nhóm.', 'Quay lại phiên audit và kiểm tra lại điểm/tóm tắt trước khi lưu hoặc gửi bài.']),
    label('Lưu ý'),
    bullets(['Chỉ dùng Risk hoặc CCP nhóm khi đúng nghiệp vụ, không dùng thay cho ghi chú không trừ điểm.', 'Risk là mức nghiêm trọng toàn bài; CCP nhóm áp dụng theo nhóm tiêu chí.', 'Ảnh minh chứng không bắt buộc ở mọi trường hợp nhưng nên gắn khi cần chứng minh lỗi nghiêm trọng.', 'Sau khi áp dụng, QC vẫn cần Lưu nháp hoặc Gửi bài để hoàn tất luồng.']),
    image(auditExecutionGuide + '11-qc-mobile-risk-assessment.png', 'Đánh Risk trên mobile', 'QC chọn lý do Risk trong bài audit.'),
    image(auditExecutionGuide + '12-qc-mobile-group-ccp-list.png', 'Danh sách CCP nhóm', 'QC mở danh sách nhóm có thể áp dụng CCP nhóm.'),
    image(auditExecutionGuide + '13-qc-mobile-group-ccp-detail.png', 'Chi tiết lý do CCP nhóm', 'QC chọn lý do CCP nhóm trước khi áp dụng.'),
  ]),
  section('audit-execution-save-submit', '7.6. Lưu nháp và gửi bài', 2, [
    label('Lưu nháp'),
    p('Lưu nháp dùng khi QC cần giữ tiến độ chấm nhưng chưa muốn nộp kết quả cuối cùng. Sau khi lưu nháp, bài vẫn có thể mở lại để tiếp tục chỉnh sửa.'),
    label('Gửi bài'),
    steps(['Kiểm tra lại tóm tắt phiên audit.', 'Bấm Gửi bài.', 'Đọc màn Xác nhận nộp bài audit, kiểm tra điểm tổng, mục vi phạm và CCP nhóm.', 'Bấm Xác nhận nộp bài.', 'Sau khi nộp, bài chuyển sang Kết quả audit; QC có thể xem lại kết quả theo quyền được cấp.']),
    label('Lưu ý'),
    bullets(['Khi đã gửi bài, dữ liệu trở thành kết quả audit chính thức.', 'Nếu bài có lỗi thật sự, các bước xác nhận điểm và Action Plan sẽ tiếp tục theo nghiệp vụ hệ thống.', 'Ghi nhận không trừ điểm vẫn có thể hiển thị như note/quan sát nhưng không làm tăng số lỗi.']),
    image(auditExecutionGuide + '08-qc-mobile-draft-saved.png', 'Lưu nháp phiên audit', 'Thông báo sau khi QC lưu nháp bài audit.'),
    image(auditExecutionGuide + '09-qc-mobile-submit-confirm.png', 'Xác nhận nộp bài audit', 'QC kiểm tra điểm và xác nhận trước khi nộp bài.'),
    image(auditExecutionGuide + '10-qc-mobile-submitted-readonly.png', 'Sau khi gửi bài audit', 'Sau khi gửi bài, hệ thống chuyển sang màn Kết quả audit.'),
  ]),

  section('audit-result', '8. Kết quả audit', 1, [
    p('Kết quả audit là nơi xem bài đã submit, chi tiết lỗi, điểm, ảnh minh chứng và export dữ liệu.'),
  ]),
  section('audit-result-list', '8.1. Danh sách kết quả audit', 2, [
    steps(['Vào Kết quả audit.', 'Chọn khoảng thời gian, Brand, AM, Cửa hàng, trạng thái nếu cần.', 'Bấm dòng kết quả để xem chi tiết.']),
    image(full + '18-qam-audit-results-list.png', 'QA danh sách kết quả audit', 'Danh sách kết quả audit của QA.'),
    image(full + '34-qc-audit-results-list.png', 'QC danh sách kết quả audit', 'Danh sách kết quả audit của QC.'),
    image(upd + 'audit-results-list-export-excel-verified.png', 'Kết quả audit có export', 'Màn kết quả audit có nút xuất Excel.'),
  ]),
  section('audit-result-detail', '8.2. Chi tiết kết quả audit', 2, [
    label('Người dùng sẽ thấy gì'),
    bullets(['Thông tin cửa hàng, checklist, người chấm, điểm.', 'Danh sách lỗi, Risk/CCP, ghi chú và ảnh minh chứng.', 'Ghi nhận 0 điểm nếu có thì hiển thị như note, không cộng vào tổng lỗi.']),
    image(full + '19-qam-audit-result-detail-01.png', 'QA chi tiết kết quả audit', 'Chi tiết kết quả audit.'),
    image(full + '35-qc-audit-result-detail.png', 'QC chi tiết kết quả audit', 'QC xem chi tiết kết quả audit.'),
  ]),
  section('audit-result-edit-export', '8.3. Chỉnh sửa kết quả và xuất Excel', 2, [
    label('Xuất Excel'),
    bullets(['Xuất theo filter người dùng đã chọn.', 'Dữ liệu vẫn theo phạm vi quyền của role.', 'Cột trong file theo form QA/QC cung cấp.']),
    image(old(21), 'Chỉnh sửa kết quả', 'Flow chỉnh sửa kết quả từ guide cũ.'),
    image(upd + 'audit-results-list-export-excel-verified.png', 'Xuất Excel kết quả audit', 'Nút xuất Excel trên màn Kết quả audit.'),
  ]),

  section('score-confirm-action-plan', '9. Xác nhận điểm và Action Plan', 1, [
    p('Sau khi QC submit bài audit, SM kiểm tra và xác nhận điểm. Nếu bài audit có lỗi trừ điểm thật sự, hệ thống dùng dữ liệu đó để tạo hoặc theo dõi Action Plan. Ghi nhận không trừ điểm chỉ để lưu note, không tính lỗi và không tạo Action Plan.'),
  ]),
  section('score-confirm', '9.1. SM xác nhận điểm và tự động xác nhận sau 48 giờ', 2, [
    label('Cách hoạt động'),
    steps(['QC submit bài audit.', 'SM nhận thông báo cần xác nhận điểm.', 'SM mở kết quả và xác nhận.', 'Nếu quá 48 giờ SM chưa xác nhận, hệ thống tự xác nhận theo kết quả QC đã nộp.']),
    label('Lưu ý'),
    bullets(['Tự xác nhận giúp bài audit không bị treo.', 'Không đồng nghĩa mọi bài audit đều tạo Action Plan; Action Plan chỉ tạo khi có lỗi thật sự.']),
    image(upd + 'notifications-score-confirmation-verified.png', 'Thông báo xác nhận điểm', 'Thông báo bài audit chờ xác nhận điểm.'),
  ]),
  section('action-plan-list', '9.2. Danh sách Action Plan', 2, [
    label('Mục đích'),
    p('Danh sách Action Plan dùng để theo dõi các lỗi cần khắc phục sau audit. Màn hình hiển thị tổng số kế hoạch đang mở, tiến độ khắc phục, số kế hoạch quá hạn và tổng số vi phạm cần xử lý.'),
    label('Người dùng sẽ thấy gì'),
    bullets(['Bảng danh sách theo cửa hàng, kế hoạch audit, số vi phạm, tiến độ, điểm, hạn xử lý và trạng thái.', 'QA có thể xem toàn bộ Action Plan trong phạm vi quyền để theo dõi tiến độ xử lý.', 'SM xem danh sách trên mobile theo dạng card để mở nhanh Action Plan của cửa hàng mình phụ trách.']),
    image(actionPlanGuide + '01-qa-action-plan-list.png', 'QA danh sách Action Plan', 'Danh sách Action Plan của QA.'),
    image(actionPlanGuide + '06-sm-mobile-action-plan-cards.png', 'SM mobile danh sách Action Plan', 'Danh sách Action Plan trên mobile của SM.'),
  ]),
  section('action-plan-detail', '9.3. Cập nhật và đóng Action Plan', 2, [
    label('Cách thao tác'),
    steps(['Mở một Action Plan từ danh sách.', 'Đọc thông tin chung: cửa hàng, checklist, điểm tổng, số vi phạm, hạn xử lý và tiến độ.', 'SM cập nhật nguyên nhân không đạt, hành động khắc phục, người thực hiện, ngày hoàn thành và ảnh minh chứng.', 'Khi các dòng đã đủ thông tin, SM có thể đóng Action Plan theo quyền.']),
    label('Lưu ý'),
    bullets(['QA thường dùng màn chi tiết để kiểm tra tiến độ và nội dung xử lý.', 'SM là người thao tác cập nhật thực tế trên mobile/field layout.', 'Một dòng Action Plan chỉ được xem là đủ thông tin khi có nguyên nhân, hành động, người thực hiện, ngày hoàn thành và minh chứng.']),
    image(actionPlanGuide + '02-qa-action-plan-detail.png', 'QA chi tiết Action Plan', 'Chi tiết Action Plan của QA.'),
    image(actionPlanGuide + '05-sm-mobile-action-plan-detail.png', 'SM mobile chi tiết Action Plan', 'Chi tiết Action Plan trên mobile của SM.'),
  ]),

  section('thong-bao', '10. Thông báo và điều hướng', 1, [
    p('Thông báo giúp người dùng biết việc cần xử lý mà không phải tự kiểm tra từng màn. Người dùng bấm biểu tượng chuông trên header để xem các việc mới, sau đó bấm vào từng thông báo để đi tới màn liên quan nếu thông báo có liên kết.'),
  ]),
  section('notification-center', '10.1. Mở trung tâm thông báo', 2, [
    label('Cách thao tác'),
    steps(['Bấm biểu tượng chuông trên header.', 'Đọc danh sách thông báo mới.', 'Bấm Đọc tất cả nếu muốn đánh dấu toàn bộ là đã đọc.', 'Bấm vào một thông báo để mở đúng màn liên quan, ví dụ kết quả audit, kế hoạch audit hoặc Action Plan.']),
    label('Người dùng sẽ thấy gì'),
    bullets(['Thông báo chưa đọc có chấm xanh.', 'Mỗi thông báo hiển thị tiêu đề, nội dung ngắn và thời gian phát sinh.', 'Người dùng có thể xoá/ẩn từng thông báo bằng nút đóng ở cạnh phải.']),
    image(notificationGuide + '01-notification-center-desktop.png', 'Trung tâm thông báo', 'Trung tâm thông báo trên dashboard.'),
  ]),
  section('notification-types', '10.2. Các loại thông báo thường gặp', 2, [
    table(['Nhóm thông báo', 'Ý nghĩa', 'Màn thường được mở khi bấm vào'], [
      ['Kế hoạch audit', 'Báo kế hoạch mới được phát hành hoặc cửa hàng được giao bài audit.', 'Kế hoạch audit hoặc Thực hiện audit.'],
      ['Bài audit đã nộp', 'QC đã submit bài audit, cần người có quyền xem hoặc xác nhận điểm theo quy trình.', 'Kết quả audit.'],
      ['Xác nhận điểm', 'Bài audit chờ SM xác nhận hoặc đã tự xác nhận sau 48 giờ.', 'Chi tiết kết quả audit.'],
      ['Action Plan', 'Action Plan mới, sắp quá hạn hoặc quá hạn cần xử lý.', 'Chi tiết Action Plan.'],
    ]),
    label('Lưu ý'),
    bullets(['Nếu thông báo áp dụng cho nhiều cửa hàng trong cùng một kế hoạch, hệ thống có thể mở danh sách và highlight dòng liên quan để người dùng chọn đúng cửa hàng.', 'Dữ liệu thông báo vẫn theo phạm vi quyền của role đang đăng nhập.']),
  ]),

  section('faq', '11. Câu hỏi thường gặp', 1, [
    p('Phần này gom các tình huống người dùng hay gặp khi thao tác QA/QC. Nội dung tập trung vào cách tự kiểm tra nhanh trước khi báo lỗi hoặc nhờ Admin/QA hỗ trợ.'),
  ]),
  section('faq-common', '11.1. Kiểm tra nhanh khi dữ liệu chưa đúng', 2, [
    table(['Câu hỏi', 'Cách xử lý'], [
      ['Dashboard không có dữ liệu', 'Kiểm tra khoảng ngày, checklist, brand, cửa hàng và phạm vi quyền.'],
      ['Không thấy cửa hàng trong filter', 'Chọn Brand sẽ lọc cửa hàng theo brand; kiểm tra dữ liệu nền cửa hàng.'],
      ['Ghi nhận 0 điểm có tính lỗi không?', 'Không. Đây là note/quan sát, không trừ điểm, không tính lỗi, không tạo Action Plan.'],
      ['Bù điểm có tạo Action Plan không?', 'Không. Bù điểm chỉ để đủ thống kê, không có lỗi chi tiết tháng hiện tại.'],
      ['Cửa hàng nào được bù điểm?', 'Chỉ cửa hàng trong plan Open và chưa có điểm/chưa chấm.'],
      ['Export Excel lấy dữ liệu nào?', 'Theo filter hiện tại và phạm vi quyền của role.'],
    ]),
  ]),
  section('faq-permission-workflow', '11.2. Quyền thao tác và luồng xử lý', 2, [
    table(['Tình huống', 'Cách hiểu đúng'], [
      ['Không thấy nút xác nhận điểm', 'Chỉ role/phạm vi được phép mới xác nhận điểm. Nếu bài đã xác nhận hoặc đã tự xác nhận, nút sẽ không còn cần hiển thị.'],
      ['Không thấy nút cập nhật Action Plan', 'QA thường xem và theo dõi; SM là người cập nhật nguyên nhân, hành động, người thực hiện, ngày hoàn thành và minh chứng trong phạm vi cửa hàng.'],
      ['Bài audit có ghi nhận không trừ điểm nhưng không có Action Plan', 'Đúng nghiệp vụ: ghi nhận không trừ điểm chỉ là note/quan sát, không tính lỗi nên không tạo Action Plan.'],
      ['Bù điểm cuối kỳ không có lỗi chi tiết', 'Đúng nghiệp vụ: bù điểm dùng để đủ thống kê cho plan đang mở, không sao chép lỗi tháng trước và không tạo Action Plan.'],
      ['Thông báo bấm vào nhưng không mở đúng dòng mong muốn', 'Kiểm tra role hiện tại và filter trên màn đích. Một số thông báo nhiều cửa hàng sẽ mở danh sách để người dùng chọn dòng đúng.'],
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
  version: 'Bản cập nhật 01/06/2026',
  scope: 'Hướng dẫn đầy đủ thao tác hệ thống QA/QC: dashboard, dữ liệu nền, checklist, audit plan, audit execution, audit result, Action Plan, notification và FAQ',
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
