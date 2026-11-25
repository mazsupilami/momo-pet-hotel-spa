# PROMPTS — Nhật ký prompt và kết quả

Ghi lại thứ tự các prompt trong cuộc trò chuyện với Claude Code và kết quả của từng prompt. Dùng cho mục 5 của báo cáo.

## Prompt 1 — Đọc đề và lập phương án (16/11/2026)

**Prompt**: Đính kèm file đề `Bài kiểm tra cuối khóa.pdf`, yêu cầu AI đóng vai chuyên gia front end và back end, đọc đề, đề xuất phương án xây dựng website, chuẩn bị nội dung báo cáo, tránh các yếu tố trừ điểm, lập kế hoạch website, database, nhúng API để đạt điểm cao nhất.

**Kết quả**:
- AI phân tích thang điểm 10 và 3 lỗi trừ điểm.
- Đề xuất kiến trúc: HTML/CSS/JS thuần + Supabase + GitHub Pages.
- Đề xuất 6 trang, các bảng dữ liệu, các chức năng ghi database, bộ file .md, lịch làm việc 16–28/11.
- AI hỏi lại: chọn thương hiệu hư cấu hay có thật.

## Prompt 2 — Chọn thương hiệu hư cấu (16/11/2026)

**Prompt**: "Hư cấu, bạn đề xuất"

**Kết quả**:
- AI đề xuất một thương hiệu cà phê và bắt đầu tạo logo, file .md, dữ liệu mẫu.
- Phần này được thay thế hoàn toàn ở Prompt 3.

## Prompt 3 — Đổi sang Momo Pet Hotel & Spa (16/11/2026)

**Prompt**: Chọn chủ đề Khách sạn & Spa chăm sóc thú cưng, thương hiệu hư cấu "Momo Pet Hotel & Spa". Yêu cầu: 3 trang liên kết (Trang chủ, Về chúng tôi có cơ sở vật chất và bảng giá, Chi tiết gói dịch vụ); Supabase lưu danh sách dịch vụ và lịch hẹn; Insert (đặt lịch), Update (sửa ngày giờ hoặc cân nặng), Delete (hủy lịch); nhúng Google Map và video YouTube.

**Kết quả**:
- Xóa phần cà phê, tạo logo Momo trước: `logo.svg`, `logo-light.svg`, `logo-mark.svg`, và 4 hình minh họa dịch vụ.
- Viết lại `PRD.md`, `DESIGN.md`, `DATABASE.md`, `CLAUDE.md`, `README.md`.
- Tạo `data/services.csv` (9 gói dịch vụ) và `supabase/schema.sql` (3 bảng `services`, `bookings`, `reviews`, quy tắc bảo mật, dữ liệu mẫu).
- Dựng 6 trang: `index.html`, `about.html`, `services.html`, `service.html`, `bookings.html`, `contact.html`, cùng `style.css`.
- Viết `config.js`, `db.js`, `app.js`: đặt lịch (insert), sửa lịch (update), hủy lịch (delete), gửi đánh giá (insert).
- Nhúng video YouTube ở Trang chủ và Google Map ở trang Liên hệ.

## Prompt 4 — Chuyển folder, kết nối Supabase, dùng ảnh thật (17/11/2026)

**Prompt**: Đặt toàn bộ project trong folder con `Momo pet`. Người dùng đã tạo project Supabase và chạy SQL tạo bảng, có file lưu thiết lập kết nối; yêu cầu kết nối database. Nhận xét giao diện chỉ có icon và hình vẽ, chưa giống website dịch vụ thú cưng thật; yêu cầu AI vào vai nhà thiết kế website để điều chỉnh.

**Kết quả**:
- Chuyển toàn bộ mã nguồn vào `Momo pet/`. File chứa mật khẩu database để ngoài folder này và được chặn bằng `.gitignore`.
- Điền Project URL và khóa publishable vào `assets/js/config.js`. Website đọc được 9 dịch vụ trực tiếp từ bảng `services` trên Supabase.
- Phát hiện Supabase chưa bật Anonymous sign-ins nên đặt lịch báo lỗi; người dùng cần bật trong Dashboard.
- Tải 20 ảnh thật miễn phí bản quyền từ Unsplash vào `assets/img/photos/`.
- Thiết kế lại: banner Trang chủ dùng ảnh spa, thêm mục "Những vị khách bốn chân", ảnh mèo Momo và ảnh đội ngũ ở trang Về chúng tôi, ảnh cơ sở vật chất, ảnh nền tiêu đề trang, ảnh thật cho từng gói dịch vụ.
- Cập nhật `data/services.csv`, `supabase/schema.sql` và thêm `supabase/update_images.sql` để đổi đường dẫn hình trong database sang ảnh thật.
- Kiểm tra trên Chrome: video YouTube phát được, bản đồ hiển thị, không có ảnh hỏng.

## Prompt 5 — Sửa thông tin thương hiệu và nâng cấp giao diện (24/11/2026)

**Prompt**: Momo là tên chú chó của người dùng, không phải mèo. Tìm ảnh mặt tiền cửa hàng dịch vụ thú cưng ở TP.HCM. Đổi địa chỉ thành 177 Tôn Thất Thuyết, Phường Khánh Hội, TP. Hồ Chí Minh. Tên các bé và đội ngũ hư cấu được giữ. Giao diện cần mang tính thương mại và chuyên nghiệp hơn. (Giữa chừng người dùng báo đã bật đăng nhập ẩn danh và chạy `update_images.sql`.)

**Kết quả**:
- Vẽ lại logo thành gương mặt chú chó Momo (giữ nguyên tên 3 file logo nên mọi trang tự cập nhật).
- Không tìm được ảnh mặt tiền cửa hàng thú cưng ở TP.HCM có giấy phép miễn phí; dùng ảnh chó mèo trước cửa kính cửa hàng (Pexels) và ảnh chú chó trên xe máy giữa phố Việt Nam. Thêm ảnh Momo (chó) và ảnh chuyên viên chăm sóc.
- Thiết kế lại toàn bộ: màu xanh ngọc và cam, font Be Vietnam Pro, thanh thông tin trên cùng, header có hotline và nút Đặt lịch, banner kèm số liệu, thẻ dịch vụ có giá, quy trình 4 bước, đánh giá khách hàng, hỏi đáp, dải kêu gọi, footer 4 cột, nút gọi nổi, bộ icon SVG riêng.
- Đổi địa chỉ trên mọi trang; Google Map trỏ đúng 177 Tôn Thất Thuyết, có nút Chỉ đường.
- Kiểm tra: ảnh dịch vụ đọc từ Supabase sau khi chạy `update_images.sql`; 6 trang không có ảnh hỏng, không tràn ngang trên điện thoại.
- Đặt lịch vẫn báo lỗi vì Supabase trả về `anonymous_users: false`; cần bấm Save changes sau khi bật.
- Viết lại `DESIGN.md`, cập nhật `PRD.md`, `DATABASE.md`, `README.md`.

## Prompt 6 — Địa danh mới, hotline, mạng xã hội, đăng nhập và Admin (24/11/2026)

**Prompt**: Theo đơn vị hành chính mới không còn Quận 4. Hotline nên là số thật. Các link Facebook, Instagram, YouTube có dẫn tới trang của shop không? Khách có cần đăng nhập để đặt lịch không? Còn Admin Login để quản lý website thì sao?

**Trả lời của người dùng cho các câu AI hỏi lại**: hotline 0968 198 406; muốn tạo Facebook Page cho shop; chọn "Thêm Admin và tài khoản khách".

**Kết quả**:
- Đổi toàn bộ "Quận 4" thành "Phường Khánh Hội"; tên phường trong đánh giá khách cũng theo địa giới mới.
- Hotline 0968 198 406 trên thanh trên cùng, footer, nút gọi nổi, trang Liên hệ.
- Bỏ Instagram và YouTube (chưa có trang); giữ nút Facebook, sẽ trỏ về Facebook Page khi tạo xong.
- Thêm `supabase/auth_admin.sql`: bảng `profiles`, `admins`, hàm `is_admin()`, cột `status` cho lịch hẹn, trigger chỉ cho admin đổi trạng thái, các quy tắc bảo mật.
- Thêm trang `account.html` (đăng nhập, đăng ký, sửa thông tin, đổi mật khẩu, đăng xuất) và `admin.html` (thống kê, đổi trạng thái và xóa lịch hẹn, sửa giá dịch vụ, xóa đánh giá).
- Header có nút Đăng nhập/tên tài khoản; form đặt lịch tự điền tên và số điện thoại của khách đã đăng nhập.

## Prompt 7 — Ảnh thật của Momo (24/11/2026)

**Prompt**: Gửi thư mục `Downloads/Momo` kèm câu "đây là hình thật của Momo".

**Kết quả**:
- Vẽ lại logo theo dáng Momo thật: lông đen vện vàng, một tai dựng một tai cụp, mõm bạc, lè lưỡi, vòng xích bạc.
- Thu nhỏ và đưa 3 ảnh của Momo vào `assets/img/photos/`: ảnh đầu trang và ảnh câu chuyện ở trang Về chúng tôi, ảnh đầu trang Tài khoản, ảnh Momo trong thư viện khách quen ở Trang chủ.
- Chuyển bộ sinh trang vào `tools/gen_pages.py` để sửa header/footer một lần cho cả 8 trang.

## Prompt 8 — Tạo Facebook Page (25/11/2026)

**Prompt**: Người dùng đang ở trang tạo Facebook Page, nhờ AI điền thông tin, thêm hình ảnh và bài đăng. AI soạn bản nháp (`facebook-page-nhap.md`, ngoài repo); người dùng duyệt: "Duyệt, không ghi demo".

**Kết quả**:
- Tạo Facebook Page **Momo Pet Hotel & Spa**: https://www.facebook.com/profile.php?id=61597136690392
- Hạng mục: Dịch vụ thú cưng, Người chăm thú cưng, Người chăm sóc thú cưng. Tiểu sử, số điện thoại +84 968 198 406, địa chỉ 177 Tôn Thất Thuyết, Phường Khánh Hội, giờ mở cửa 8:00 – 20:00 mỗi ngày.
- Ảnh đại diện là logo Momo (chuyển SVG sang PNG 720×720), ảnh bìa là ảnh thật Momo bên bờ biển.
- Đăng 3 bài: giới thiệu dịch vụ (ảnh spa), câu chuyện của Momo (2 ảnh thật), bảng giá (ảnh cắt tỉa).
- Bỏ qua bước kết nối WhatsApp và mời bạn bè; không bật quảng cáo trả phí.
- Nút Facebook trên website trỏ về Page mới.

## Prompt 9 — Tách giao diện Admin, gộp đăng nhập (25/11/2026)

**Prompt**: Hỏi vì sao trang Quản trị cũng có "Lịch hẹn" và "Đặt lịch"; nhờ đánh giá có cần tách Admin login và Guest login không. Gửi ảnh trang Tài khoản khi đăng nhập bằng tài khoản admin (vẫn hiện thẻ "Lịch hẹn của tôi", "Đặt lịch mới").

**Kết quả**:
- Đánh giá: giữ **một** hệ thống tài khoản và **một** form đăng nhập (Supabase Auth), phân quyền bằng bảng `admins` và hàm `is_admin()`; tách **giao diện** Admin khỏi giao diện khách.
- Trang Quản trị có header/footer riêng: logo, nhãn "Trang quản trị", nút "Xem website"; bỏ menu khách, nút Đặt lịch, nút gọi.
- Bỏ form đăng nhập riêng trong `admin.html`; chưa đăng nhập thì chuyển sang `account.html?next=admin`.
- Admin đăng nhập xong được chuyển thẳng vào trang Quản trị; trên header, nút tài khoản đổi thành "Quản trị". Trang Tài khoản của admin không còn thẻ dành cho khách.

## Prompt 10 — Hiện mật khẩu, tách Đăng nhập/Đăng ký, khôi phục mật khẩu (25/11/2026)

**Prompt**: Đã đăng nhập admin. Thêm nút mắt hiện mật khẩu ở trang đăng nhập admin và khách. Tách trang đăng nhập và đăng ký; khi chưa có tài khoản thì có link chuyển sang đăng ký. Thêm chức năng khôi phục mật khẩu (gửi mail).

**Kết quả**:
- Kiểm tra trang Quản trị khi đã đăng nhập: đổi trạng thái lịch, sửa giá (đã trả lại giá cũ), xóa đánh giá và lịch hẹn thử đều chạy trên Supabase.
- Thêm 4 trang: `login.html`, `register.html`, `forgot-password.html`, `reset-password.html`, bố cục form bên trái, ảnh Momo bên phải. `account.html` chỉ còn hồ sơ, đổi mật khẩu, đăng xuất.
- Mọi ô mật khẩu có nút mắt hiện/ẩn; trang Đăng ký kiểm tra 2 mật khẩu khớp nhau.
- Khôi phục mật khẩu: gửi email bằng `resetPasswordForEmail`, liên kết mở `reset-password.html` để đặt mật khẩu mới; liên kết sai hoặc hết hạn thì báo lỗi và cho gửi lại.
- Một trang đăng nhập chung: admin vào trang Quản trị, khách vào trang Tài khoản.

## Prompt 11 — Instagram, YouTube, test toàn bộ và deploy (25/11/2026)

**Prompt**: Người dùng đã tạo Instagram (`momo_suteki`) và YouTube (`@MomoPetHotelSpa`), nhờ thêm logo, thông tin, bài đăng/video và thay link SNS trên website. Nhờ cấu hình URL Configuration, test website, database, mật khẩu, tạo tài khoản khách, đặt lịch, chức năng admin; nếu ổn thì deploy lên GitHub để chạy trên web.

**Kết quả**:
- Test trên máy: khách ẩn danh đặt lịch, đăng ký (lịch được giữ lại), sửa hồ sơ, đăng xuất, đăng nhập sai/đúng, sửa và hủy lịch, khách bị chặn ở trang Quản trị; admin đổi trạng thái, tìm kiếm, lọc, xóa. Sửa thông báo lỗi "mật khẩu mới trùng mật khẩu cũ" sang tiếng Việt.
- Tạo repo Public `mazsupilami/momo-pet-hotel-spa`, push code, bật GitHub Pages: https://mazsupilami.github.io/momo-pet-hotel-spa/
- Supabase URL Configuration: Site URL là link GitHub Pages; Redirect URLs gồm link GitHub Pages và `http://localhost:8000`.
- Test lại trên website thật: đăng nhập, đặt, sửa, hủy lịch; gửi email khôi phục mật khẩu (Supabase ghi nhận đã gửi).
- Instagram: ảnh đại diện logo Momo, tiểu sử, 3 bài đăng (giới thiệu, câu chuyện Momo, bảng giá).
- YouTube: ảnh đại diện, ảnh bìa, mô tả kênh, 3 liên kết (website, Facebook, Instagram), video giới thiệu 30 giây tự dựng từ ảnh (https://youtu.be/BGgRwsH_8vE).
- Website: nút Facebook, Instagram, YouTube trỏ đúng trang của shop; nhúng video giới thiệu của shop vào trang Về chúng tôi.
- Viết `BAOCAO.md` kèm ảnh chụp màn hình trong `docs/screenshots/`.

## Prompt 12 — Admin có nên đặt lịch ở trang khách? (25/11/2026)

**Prompt**: Gửi ảnh trang chi tiết dịch vụ khi đăng nhập tài khoản quản trị vẫn thấy form đặt lịch. Hỏi có đúng logic không, nhờ đánh giá có nên sửa.

**Đánh giá**: chưa hợp lý. Lịch đặt từ form khách gắn với tài khoản admin, lẫn với lịch của khách; admin viết đánh giá cho chính tiệm cũng không nên. Nhu cầu thật là nhân viên đặt hộ khách gọi hotline, nên chức năng này thuộc trang Quản trị.

**Kết quả**:
- Admin vào trang chi tiết dịch vụ: form đặt lịch và form đánh giá được thay bằng thông báo và nút "Tạo lịch hẹn cho khách".
- Trang Quản trị có tab "Tạo lịch hẹn": chọn dịch vụ, thông tin khách và thú cưng, ngày giờ, trạng thái (mặc định Đã xác nhận). Mở thẳng bằng `admin.html#tao-lich`.
- Trang Lịch hẹn của tôi nhắc admin xem toàn bộ lịch ở trang Quản trị; sửa link đăng nhập cho khách sang `login.html`.
- Đã test trên máy: tạo lịch hộ khách thành công, đã xóa lịch thử.
