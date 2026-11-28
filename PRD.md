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
| Trang chủ | `index.html` | Banner, số liệu, dịch vụ nổi bật (từ database), lý do chọn Momo, quy trình 4 bước, video YouTube, dàn thú cưng ló đầu (rê chuột xem giống và tính cách), đánh giá khách hàng, thư viện ảnh, 3 bài cẩm nang mới, hỏi đáp |
| Về chúng tôi | `about.html` | Câu chuyện thương hiệu kèm ảnh thật của Momo, mốc thời gian, cơ sở vật chất, đội ngũ, **Cam kết chất lượng** (`#cam-ket`), bảng giá (từ database), giới thiệu cửa hàng |
| Dịch vụ | `services.html` | Toàn bộ gói dịch vụ từ database, lọc theo nhóm (Spa, Khách sạn, Combo, Tại nhà), bảng giá theo cân nặng, **Ưu đãi** (`#uu-dai`), chính sách |
| Cẩm nang | `cam-nang.html` | Danh sách bài viết chăm sóc thú cưng, lọc theo chủ đề (đọc từ `data/articles.json`) |
| Bài viết | `bai-viet.html?slug=…` | Nội dung một bài cẩm nang, bài viết liên quan, nút tư vấn Zalo |
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
| F16 | Chatbot tư vấn: câu gõ tự do trả lời bằng AI Google Gemini qua Supabase Edge Function `chat` (khóa API giữ trên Supabase); nút câu hỏi nhanh, hoặc khi AI lỗi/hết lượt, trả lời theo từ khóa (báo giá từ database, đặt lịch, giờ mở cửa, khách sạn, đưa đón, chuyển Zalo) | select | `services` |
| F17 | Liên hệ nhanh: thanh dọc gồm Zalo, Messenger, Gọi hotline, Facebook, Instagram, YouTube (điện thoại chỉ hiện 3 nút đầu). Số điện thoại luôn là link gọi; Zalo có nút riêng. Thanh trên cùng không đặt mạng xã hội | — | — |
| F18 | Bảng giá theo cân nặng (dưới 10 kg, 10–20 kg +30%, trên 20 kg +60%) tính từ database | select | `services` |
| F19 | Pop-up ưu đãi khách mới (sau 3 giây, mỗi phiên một lần), dàn thú cưng ló đầu trên thanh đỏ, hiệu ứng rê chuột và hiện dần khi cuộn | — | — |
| F20 | Dịch vụ tại nhà: Tắm & vệ sinh tại nhà, Cắt tỉa tại nhà (nhóm "Tại nhà") | select / insert | `services`, `bookings` |
| F21 | Cẩm nang: 6 bài viết, lọc theo chủ đề, trang chi tiết bài viết | — | `data/articles.json` |
| F23 | Menu sổ xuống: "Về chúng tôi", "Dịch vụ & Giá" (3 cột + thẻ ưu đãi), "Cẩm nang" (theo chủ đề); link lọc sẵn `services.html?nhom=…`, `cam-nang.html?chu-de=…`; điện thoại dạng gập mở | — | — |
| F24 | Đánh giá chỉ dành cho khách có tài khoản email và lịch hẹn gói đó ở trạng thái "Hoàn thành"; mỗi lịch một đánh giá; nhãn "Đã sử dụng dịch vụ"; kiểm tra bằng RLS trong database | **insert** | `reviews`, `bookings` |
| F25 | Ảnh bé trong đánh giá (thu nhỏ 1200px, tối đa 2 MB) | **insert** (Storage) | bucket `review-photos` |
| F26 | Báo lịch hẹn mới vào Telegram của tiệm (Database Webhook + Edge Function `notify-booking`) | — | `bookings` |
| F27 | Trang Quản trị cập nhật trực tiếp (Supabase Realtime), âm báo khi có lịch mới | select | `bookings` |
| F28 | Tính phí đưa đón theo quãng đường (Geolocation, OpenStreetMap Nominatim, OSRM): miễn phí 3 km, sau đó 10.000đ/km, ngoài 15 km mời nhắn Zalo | — | ghi vào `bookings.note` |
| F29 | Thời tiết TP.HCM ở Trang chủ kèm lời khuyên chăm sóc (Open-Meteo) | — | — |
| F30 | Nút "Thêm vào lịch" (Google Calendar, file .ics) sau khi đặt lịch và ở trang Lịch hẹn | — | — |
| F31 | Chống spam bằng Cloudflare Turnstile cho đặt lịch, đăng nhập, đăng ký, quên mật khẩu (qua CAPTCHA của Supabase Auth) | — | — |
| F22 | Ưu đãi (khách mới, thẻ 10+1, lưu trú từ 5 đêm) và Cam kết chất lượng (quy trình xử lý phản hồi) | — | — |

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
