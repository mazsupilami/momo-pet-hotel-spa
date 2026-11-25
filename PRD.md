# PRD — Website Momo Pet Hotel & Spa

Tài liệu yêu cầu sản phẩm (Product Requirements Document). File này trả lời câu hỏi **"website cần làm được gì và cho ai"**. AI đọc file này trước khi viết code để không làm thiếu hoặc làm thừa chức năng.

## 1. Thương hiệu

- **Tên**: Momo Pet Hotel & Spa (thương hiệu hư cấu, tạo riêng cho bài thi).
- **Lĩnh vực**: khách sạn và spa chăm sóc thú cưng (chó, mèo).
- **Câu chuyện**: mở cửa năm 2020 tại Phường Khánh Hội, TP.HCM, bắt đầu từ Momo, chú chó của gia đình người sáng lập. Gương mặt Momo là logo của thương hiệu.
- **Địa chỉ**: 177 Tôn Thất Thuyết, Phường Khánh Hội, TP. Hồ Chí Minh.
- **Slogan**: "Chăm sóc chuẩn spa, yêu thương như ở nhà."
- **Logo**: `assets/img/logo.svg` (nền sáng), `assets/img/logo-light.svg` (nền tối), `assets/img/logo-mark.svg` (favicon). Logo được tạo trước khi dựng trang và mọi trang đều dùng đúng các file này.

## 2. Người dùng

- **Khách vãng lai**: đặt lịch không cần tài khoản (Supabase cấp phiên ẩn danh, lịch hẹn gắn với trình duyệt).
- **Khách có tài khoản**: đăng nhập bằng email để xem lịch hẹn trên mọi thiết bị; thông tin được điền sẵn khi đặt lịch.
- **Quản trị viên**: nhân viên tiệm, đăng nhập trang `admin.html` để xác nhận lịch và quản lý dữ liệu.

Nhu cầu chính:

- Chủ nuôi muốn xem dịch vụ, bảng giá và đặt lịch chăm sóc cho thú cưng.
- Chủ nuôi đã đặt lịch muốn đổi ngày giờ, cập nhật cân nặng của bé, hoặc hủy lịch.
- Người muốn biết spa ở đâu, mở cửa giờ nào.

## 3. Các trang

| Trang | File | Nội dung |
|---|---|---|
| Trang chủ | `index.html` | Banner, số liệu, dịch vụ nổi bật (từ database), lý do chọn Momo, quy trình 4 bước, video YouTube, đánh giá khách hàng, thư viện ảnh, hỏi đáp |
| Về chúng tôi | `about.html` | Câu chuyện thương hiệu, mốc thời gian, cơ sở vật chất, đội ngũ, bảng giá (từ database), giới thiệu cửa hàng |
| Dịch vụ | `services.html` | Toàn bộ gói dịch vụ từ database, lọc theo nhóm |
| Chi tiết dịch vụ | `service.html?id=…` | Thông tin một gói, form đặt lịch, đánh giá của khách |
| Lịch hẹn của tôi | `bookings.html` | Xem lịch đã đặt, sửa lịch, hủy lịch |
| Liên hệ | `contact.html` | Địa chỉ, giờ mở cửa, Google Map |
| Đăng nhập | `login.html` | Một trang đăng nhập chung cho khách và admin; link Quên mật khẩu, link sang Đăng ký |
| Đăng ký | `register.html` | Tạo tài khoản khách; link sang Đăng nhập |
| Quên mật khẩu | `forgot-password.html` | Gửi email chứa liên kết đặt lại mật khẩu |
| Đặt lại mật khẩu | `reset-password.html` | Mở từ liên kết trong email, đặt mật khẩu mới |
| Tài khoản của tôi | `account.html` | Sửa họ tên, số điện thoại, đổi mật khẩu, đăng xuất |
| Quản trị | `admin.html` | Giao diện riêng cho quản trị viên (đăng nhập ở trang Tài khoản); quản lý lịch hẹn, giá dịch vụ, đánh giá |

Mọi trang có chung header và footer, trong đó có đủ link tới các trang còn lại.

## 4. Chức năng

| # | Chức năng | Thao tác database | Bảng |
|---|---|---|---|
| F1 | Hiển thị dịch vụ và bảng giá | select | `services` |
| F2 | Đặt lịch hẹn chăm sóc | **insert** | `bookings` |
| F3 | Sửa ngày, giờ hẹn, cân nặng thú cưng, ghi chú | **update** | `bookings` |
| F4 | Hủy lịch hẹn | **delete** | `bookings` |
| F5 | Gửi đánh giá dịch vụ | **insert** | `reviews` |
| F6 | Lọc dịch vụ theo nhóm (Spa, Khách sạn, Combo) | — | — |
| F7 | Nhúng video YouTube và Google Map | — | — |
| F8 | Đăng ký, đăng nhập, đăng xuất tài khoản khách | Supabase Auth | `auth.users` |
| F9 | Sửa họ tên, số điện thoại của tài khoản | **insert / update** | `profiles` |
| F10 | Quản trị: đổi trạng thái lịch hẹn (chờ xác nhận, đã xác nhận, hoàn thành, đã hủy) | **update** | `bookings` |
| F11 | Quản trị: xóa lịch hẹn, xóa đánh giá | **delete** | `bookings`, `reviews` |
| F12 | Quản trị: sửa giá, chọn dịch vụ nổi bật | **update** | `services` |
| F13 | Khôi phục mật khẩu qua email | Supabase Auth | `auth.users` |
| F14 | Nút mắt hiện/ẩn mật khẩu ở mọi ô mật khẩu | — | — |
| F15 | Quản trị: tạo lịch hẹn hộ khách gọi hotline hoặc đến tiệm, chọn sẵn trạng thái | **insert** | `bookings` |

**Quy tắc vai trò**: tài khoản quản trị không dùng form đặt lịch và form đánh giá dành cho khách (hai form được thay bằng thông báo và link sang trang Quản trị). Admin đặt lịch hộ khách trong tab "Tạo lịch hẹn" của trang Quản trị.

## 5. Yêu cầu khác

- Chạy được trên GitHub Pages (web tĩnh, không có bước build).
- Xem tốt trên điện thoại và máy tính.
- Nếu không kết nối được Supabase, danh sách dịch vụ vẫn hiển thị nhờ `data/services.csv`; các chức năng ghi dữ liệu báo lỗi rõ ràng.
- Không cho đặt lịch vào ngày đã qua.

## 6. Định hướng giao diện

Website phải trông như một doanh nghiệp dịch vụ thú cưng đang hoạt động: ảnh chụp thật, giá niêm yết rõ ràng, hotline và nút đặt lịch luôn trong tầm mắt, có số liệu, đánh giá khách hàng, quy trình và hỏi đáp để tạo niềm tin. Chi tiết ở `DESIGN.md`.

## 7. Ngoài phạm vi

- Thanh toán trực tuyến.
- Trang quản trị.
