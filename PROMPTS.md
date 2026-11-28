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

## Prompt 13 — Footer, học website tham khảo, Zalo, chatbot, hiệu ứng (28/11/2026)

**Prompt**: Bỏ dòng "Thương hiệu hư cấu cho bài thi…" và "Ảnh: Unsplash, Pexels" ở footer. Tham khảo cherrypetcoffee.com/khach-san-thu-cung và petservicehcm.com về dịch vụ, giao diện, tính năng. Dùng ảnh từ internet thay cho ảnh của Momo để website chuyên nghiệp, thương mại hơn. Bấm số điện thoại chưa chuyển sang Zalo như các web trên. Xem xét thêm chatbot tư vấn. (Bổ sung giữa chừng: hai web trên có hiệu ứng khi rê chuột, pop-up, "dàn chó", thêm nếu phù hợp.)

**Kết quả**:
- Footer chỉ còn "© 2026 Momo Pet Hotel & Spa".
- Thay 3 ảnh Momo bằng ảnh Unsplash (chủ ôm chó, Golden Retriever, chủ ôm Labrador) ở trang Về chúng tôi, Tài khoản, các trang đăng nhập, thư viện ảnh; xóa ảnh Momo khỏi project. Logo vẫn vẽ theo Momo.
- Liên hệ: thanh mạng xã hội dọc bên trái (Zalo, Messenger, Facebook, Instagram, YouTube), nút gọi rung nhẹ, nút "Chat Zalo" ở thanh trên cùng, trang Liên hệ, chi tiết dịch vụ, dải kêu gọi. Trên máy tính bấm số điện thoại mở Zalo, trên điện thoại vẫn gọi.
- Chatbot "Trợ lý Momo" (`assets/js/chatbot.js`): trả lời theo từ khóa, giá đọc từ Supabase, chuyển sang Zalo khi không hiểu; đã thử 14 câu hỏi mẫu. Đề xuất nâng cấp AI qua Supabase Edge Function (chưa làm vì cần khóa API, có chi phí).
- Học từ web tham khảo: bảng giá theo cân nặng (tính từ database), đưa đón tận nhà, hỏi đáp và lưu ý mới.
- Hiệu ứng: pop-up ưu đãi khách mới (trang chủ, mỗi phiên một lần), dải ảnh "đàn boss nhà Momo" chạy ngang dừng khi rê chuột, hiệu ứng rê chuột cho thẻ, icon, menu, logo, hiện dần khi cuộn, nút lên đầu trang.
- Chụp lại ảnh màn hình cho báo cáo.

## Prompt 14 — Ảnh Momo, giảm trùng lặp, dịch vụ tại nhà, cẩm nang, dàn thú cưng (28/11/2026)

**Prompt**: Trang Về chúng tôi có thể dùng ảnh thật của Momo cho khớp logo. Giao diện đang trùng lặp: nhiều số điện thoại cùng chuyển về Zalo, icon mạng xã hội ở cả thanh ngang lẫn thanh dọc (thanh dọc còn hiện ô trắng); đánh giá có cần thiết không. Tham khảo petservicehcm.com (Spa & Tắm, Dịch vụ tại nhà, Khách sạn – Trông giữ, Bảng giá, Cam kết chất lượng) và mục Tin tức/Cẩm nang của cherrypetcoffee.com. Chưa thấy pop-up và "dàn thú cưng" như ảnh chụp (hàng chó ló đầu trên thanh đỏ, rê chuột hiện thông tin).

**Kết quả**:
- Ô trắng ở thanh dọc do trình duyệt giữ bản cũ của `icons.svg` (chưa có icon Zalo, Messenger). Thêm số phiên bản `icons.svg?v=…` cho mọi icon.
- Giảm trùng lặp: thanh trên cùng chỉ còn địa chỉ, giờ mở cửa, hotline (bỏ nút Chat Zalo và icon mạng xã hội); thanh dọc chỉ còn Zalo, Messenger, Gọi; bỏ nút gọi nổi; Facebook, Instagram, YouTube ở footer. Bỏ việc tự đổi số điện thoại thành link Zalo: số điện thoại luôn để gọi, Zalo có nút riêng.
- Trang Về chúng tôi dùng ảnh thật của Momo (ảnh đầu trang bên biển, ảnh câu chuyện), các trang khác vẫn dùng ảnh dịch vụ.
- Dịch vụ tại nhà: 2 gói "Tắm & vệ sinh tại nhà", "Cắt tỉa tại nhà" (nhóm "Tại nhà") trong `data/services.csv` và `supabase/add_home_services.sql`.
- Ưu đãi (`services.html#uu-dai`): khách mới -20% Combo, thẻ 10+1, lưu trú từ 5 đêm -10%. Cam kết chất lượng (`about.html#cam-ket`): 6 cam kết, quy trình xử lý phản hồi 3 bước, bảng tình huống và cách hỗ trợ.
- Cẩm nang: trang `cam-nang.html` (lọc theo chủ đề) và `bai-viet.html?slug=…` (bài liên quan, nút Zalo), 6 bài trong `data/articles.json`; Trang chủ hiện 3 bài mới; menu thêm "Cẩm nang"; chatbot trả lời về cẩm nang, ưu đãi, dịch vụ tại nhà.
- Dàn thú cưng: 8 bé (Pug, Poodle, Corgi, Border Collie, mèo ta, Chihuahua, Golden, Poodle lai) ló đầu trên thanh đỏ; rê chuột hoặc Tab thì bé nhô lên, hiện giống và tính cách. Điện thoại hiện 5 bé, không cuộn ngang.
- Pop-up ưu đãi hiện sau 3 giây (trước là 6 giây nên dễ bỏ lỡ), mỗi phiên một lần.

## Prompt 15 — Mạng xã hội ở thanh dọc, tài khoản test, menu sổ xuống, chatbot Gemini (28/11/2026)

**Prompt**: Thêm Facebook, Instagram, YouTube vào thanh dọc. Không đăng nhập được bằng tài khoản khách thử, kiểm tra lại. Mật khẩu admin đã đổi, ghi vào file tài khoản test để giáo viên đăng nhập chấm bài. Đánh giá có nên làm menu sổ xuống như petservicehcm.com. Chatbot AI thật: kiểm tra có dùng được API của Google với hạn mức miễn phí mỗi ngày không.

**Kết quả**:
- Thanh dọc: Zalo, Messenger, Gọi, vạch ngăn, Facebook, Instagram, YouTube. Trên điện thoại chỉ hiện 3 nút đầu để không che nội dung.
- Tài khoản khách thử: code đăng nhập dùng chung với admin (admin đăng nhập được) nên lỗi nằm ở dữ liệu tài khoản; soạn câu SQL kiểm tra và sửa (xác nhận email, đặt lại mật khẩu) để người dùng chạy trong Supabase.
- File `tai-khoan-test.md` (ngoài repo) ghi link website, cách đăng nhập, tài khoản khách và ô để người dùng tự điền mật khẩu admin mới (Claude không ghi mật khẩu admin).
- Menu sổ xuống: làm được với HTML/CSS hiện có, đề xuất cho "Dịch vụ & Giá" và "Về chúng tôi", dạng gập mở trên điện thoại.
- Chatbot Gemini: Google AI Studio có hạn mức miễn phí, không cần thẻ (theo các báo cáo tháng 10–11/2026: Flash-Lite khoảng 500 lượt/ngày, Flash khoảng 20 lượt/ngày; Google chỉ hiện số chính xác trong AI Studio). Khóa API phải để trong Supabase Edge Function; khi hết lượt thì quay về chatbot theo từ khóa hiện có.

## Prompt 16 — Menu sổ xuống (28/11/2026)

**Prompt**: Làm menu sổ xuống (người dùng chọn sau khi được đánh giá ở Prompt 15).

**Kết quả**:
- "Về chúng tôi": Câu chuyện Momo, Cơ sở vật chất, Đội ngũ, Cam kết chất lượng, Bảng giá niêm yết, Ghé thăm cửa hàng (thêm id cho từng phần của trang).
- "Dịch vụ & Giá": 3 cột Spa & Grooming, Khách sạn & Tại nhà, Bảng giá, cùng thẻ ưu đãi khách mới -20%. "Khách sạn thú cưng" và "Chăm sóc tại nhà" mở trang Dịch vụ đã lọc sẵn (`?nhom=`).
- "Cẩm nang": 4 chủ đề, mở trang Cẩm nang đã lọc sẵn (`?chu-de=`).
- Máy tính: rê chuột hoặc bấm mũi tên; Esc, bấm ra ngoài hoặc chọn mục thì đóng. Điện thoại: gập mở trong menu ☰, ẩn thanh liên hệ khi menu đang mở.
- Đã thử trên máy: lọc Khách sạn hiện 3 phòng, lọc Sức khỏe hiện 1 bài, menu điện thoại không cuộn ngang, không có lỗi console.

## Prompt 17 — Chatbot AI bằng Google Gemini (28/11/2026)

**Prompt**: Làm chatbot Gemini (sau khi đánh giá hạn mức miễn phí ở Prompt 15).

**Kết quả**:
- `supabase/functions/chat/index.ts`: Edge Function nhận tối đa 8 lượt hội thoại (mỗi tin ≤ 500 ký tự), ghép hướng dẫn hệ thống (thông tin cửa hàng, chính sách, ưu đãi, bảng giá đọc từ bảng `services`) rồi gọi Gemini API. Chỉ nhận yêu cầu từ link GitHub Pages và localhost. Mô hình mặc định `gemini-flash-lite-latest` (tên gọi chung luôn trỏ tới bản Flash-Lite mới, hạn mức miễn phí cao nhất), đổi được qua secret `GEMINI_MODEL`.
- Khóa API đặt trong Supabase Secrets `GEMINI_API_KEY`, không nằm trong code hay GitHub.
- `chatbot.js`: câu gõ tự do gửi cho AI; nút câu hỏi nhanh trả lời theo từ khóa để tiết kiệm lượt; AI lỗi, hết lượt hoặc chưa cài thì tự quay về chatbot từ khóa. Câu trả lời AI qua `aiHtml()`: escape HTML, chỉ giữ chữ đậm, xuống dòng, link nội bộ và Zalo.
- Đã thử khi chưa deploy function: chatbot quay về trả lời theo từ khóa; bộ lọc chặn link `javascript:` và thẻ `<img onerror>`.
- Sau khi người dùng deploy: Supabase tự đặt slug function là `bright-service` (đã thêm `CHAT_FUNCTION` vào `config.js`); secret lúc đầu lưu sai tên "Gemini API Key 3", người dùng đổi lại thành `GEMINI_API_KEY`.
- Thử trực tiếp function: bé 15 kg tắm gội tính đúng 150.000đ × 1,3 = 195.000đ kèm ưu đãi; câu lạc đề (làm thơ bóng đá) bị từ chối lịch sự; hội thoại nhiều lượt gửi mèo 6 đêm Deluxe tính đúng 1.680.000đ, giảm 10% còn 1.512.000đ (AI tự sửa giá sai trong câu trước theo database). Yêu cầu từ trang lạ bị chặn (403).
- Thử trên GitHub Pages: hỏi phòng VIP, chatbot trả lời bằng AI kèm link tới trang Phòng VIP có camera.

## Prompt 18 — Đặt lịch không cần tài khoản và quyền viết đánh giá (28/11/2026)

**Prompt**: Với dịch vụ spa, khách sạn thú cưng có nên cho đặt lịch không cần tài khoản? Khách chưa đăng nhập, chưa từng dùng dịch vụ cũng viết được đánh giá, có hợp lý không? Đề xuất hướng giải quyết.

**Kết quả**: Giữ đặt lịch không cần tài khoản (giống thói quen đặt qua điện thoại/Zalo; số điện thoại bắt buộc, lịch luôn chờ lễ tân xác nhận). Đánh giá thì không hợp lý: database cho mọi phiên, kể cả ẩn danh, gửi đánh giá. Đề xuất chỉ cho tài khoản email có lịch "Hoàn thành" của gói đó, mỗi lịch một đánh giá, kiểm tra bằng RLS.

## Prompt 19 — Luật đánh giá và tích hợp API (28/11/2026)

**Prompt**: Làm theo đề xuất về đánh giá, sau đó làm Telegram, Realtime, tính phí đưa đón, thời tiết, nút thêm vào lịch, ảnh bé trong đánh giá, chống spam form đặt lịch.

**Kết quả**:
- `supabase/features_v2.sql`: hàm `can_review`, luật RLS mới cho `reviews`, cột `booking_id` (unique) và `photo_url`; lịch "Hoàn thành" khách không sửa/xóa được; bucket `review-photos` (2 MB, chỉ ảnh, mỗi khách một thư mục); thêm `bookings` vào Realtime.
- Trang chi tiết dịch vụ: ô đánh giá theo từng trường hợp (chưa đăng nhập, chưa có lịch hoàn thành, có lịch để đánh giá), chọn lịch hẹn, tải ảnh bé; nhãn "Đã sử dụng dịch vụ". Trang Lịch hẹn: lịch hoàn thành có nút "Đánh giá dịch vụ".
- Telegram: `supabase/functions/notify-booking/index.ts`, gọi từ Database Webhook, xác thực bằng header bí mật.
- Realtime: trang Quản trị tự tải lại danh sách và thống kê khi có thay đổi, âm báo và thông báo khi có lịch mới.
- Đưa đón: ô "Đưa đón tận nhà", nhập địa chỉ hoặc dùng vị trí; thử: địa chỉ cách 1,9 km miễn phí, địa chỉ Thủ Đức 16,4 km báo ngoài khu vực. Thông tin đưa đón ghi vào ghi chú lịch hẹn.
- Thời tiết: dải thời tiết dưới số liệu Trang chủ (thử: 26°C, mưa rào, lời khuyên lau khô cho bé).
- Thêm vào lịch: Google Calendar và .ics (đã kiểm tra 9:30 giờ VN = 02:30 UTC) sau khi đặt lịch và trên trang Lịch hẹn.
- Chống spam: ô Turnstile tự hiện khi điền `TURNSTILE_SITE_KEY`, token gửi kèm khi tạo phiên khách, đăng nhập, đăng ký, quên mật khẩu.
- Webhook: giao diện Database > Webhooks không còn ở chỗ cũ, thay bằng `supabase/booking_webhook.sql` (trigger `pg_net`, chuỗi bí mật lưu trong Vault). Thử: đặt lịch "Test Telegram", log function `notify-booking` ghi POST 200 (Telegram nhận tin), sau đó hủy lịch thử.

## Prompt 20 — Link Ưu đãi, ảnh cơ sở vật chất, ảnh nhân viên, thanh tìm kiếm (28/11/2026)

**Prompt**: Ở Trang chủ bấm "Ưu đãi" ở footer chưa tới đúng phần ưu đãi. Camera, Bếp riêng, Góc y tế chưa có hình. Thêm ảnh nhân viên ở phần đội ngũ để tăng uy tín (tham khảo theanimaldoctors.org). Có nên thêm thanh tìm kiếm trên cùng như petmart.vn?

**Kết quả**:
- Nguyên nhân: danh sách dịch vụ và bảng giá tải từ database sau khi trình duyệt đã cuộn tới `#uu-dai`, nội dung dài ra làm lệch vị trí. Sửa: sau khi trang tải xong dữ liệu, `app.js` cuộn lại đúng mục; thêm `scroll-padding-top` để tiêu đề không bị header che. Thử: `services.html#uu-dai` và `about.html#doi-ngu` đều dừng đúng đầu mục.
- Cơ sở vật chất: 3 thẻ Camera 24/7, Bếp riêng, Góc y tế đổi sang thẻ có ảnh giống hàng trên (ảnh Unsplash).
- Đội ngũ: thêm 4 thẻ nhân viên có ảnh, tên, vai trò, mô tả (Quản lý, Trưởng nhóm grooming, Chăm sóc lưu trú, Lễ tân). Tên hư cấu, ảnh minh họa.
- Thanh tìm kiếm: đánh giá là chưa cần thanh lớn như petmart.vn (trang bán hàng hàng nghìn sản phẩm); Momo chỉ có 11 dịch vụ và 6 bài viết, menu sổ xuống và chatbot đã đủ. Phương án gọn hơn nếu muốn: biểu tượng kính lúp mở ô tìm nhanh dịch vụ và bài cẩm nang.

## Prompt 21 — Form đặt lịch cho khách sạn và trông giữ (28/11/2026)

**Prompt**: Khách sạn và trông giữ cần số ngày, có nên dùng chung form với các dịch vụ khác? Đánh giá trước khi làm. (Sau đó: làm theo đề xuất.)

**Đánh giá**: form chỉ có một ngày và một giờ nên gửi nhiều đêm không ghi được ngày trả, không tính được tổng tiền và ưu đãi từ 5 đêm. Đề xuất giữ một form nhưng các ô đổi theo loại gói.

**Kết quả**:
- `supabase/stay_dates.sql`: cột `end_date`, `diet`, `medication` và ràng buộc (ngày trả không trước ngày nhận, tối đa 30 ngày).
- Form: khách sạn có Ngày nhận bé, Ngày trả bé, Giờ nhận bé, Chế độ ăn, Thuốc; trông giữ có Từ ngày, Đến ngày; spa giữ nguyên. Tạm tính hiện ngay. Thử: Deluxe 6 đêm bé 15 kg = 2.184.000đ, giảm 10% còn 1.966.000đ; trông giữ 5 ngày = 600.000đ; tắm bé 22 kg = 240.000đ.
- Trang Lịch hẹn: hiện khoảng ngày, số đêm, chế độ ăn, thuốc, tạm tính; sửa được ngày trả. Quản trị: cột ngày hiện khoảng ngày, doanh thu tính theo số đêm/ngày và cân nặng, "Lịch hôm nay" gồm bé đang lưu trú; tab Tạo lịch có ngày trả. Telegram và nút thêm vào lịch hiện khoảng ngày.
- Chưa chạy SQL thì lịch vẫn lưu được, thông tin ngày trả, ăn, thuốc được ghi vào ghi chú.
- Không làm quản lý phòng trống (ghi vào hướng phát triển).
- Sau khi người dùng chạy `stay_dates.sql` và deploy lại `notify-booking`: đặt thử Phòng Deluxe 01/12 → 07/12 (6 đêm), bé 15 kg. Trang Lịch hẹn hiện đúng khoảng ngày, chế độ ăn, thuốc (lưu ở cột riêng, không còn ghi vào ghi chú), tạm tính 1.966.000đ; Telegram nhận tin (log POST 200). Đã hủy lịch thử.

## Prompt 22 — Logic Quản trị, vai trò, kiểm thử toàn bộ (29/11/2026)

**Prompt**: Quản trị chỉ đổi trạng thái và xóa, chưa sửa được lịch; có nên cho quản trị xem, xóa, sửa tài khoản khách? Thanh quản trị hiện email, nên hiện email hay vai trò? Một admin hay nhiều vai trò? Tài khoản khách vẫn sửa được lịch đã hủy. Phần phí đưa đón chưa có địa chỉ gợi ý (ví dụ "92 Nguyễn Hữu Cảnh" tính ra 0,8 km). Đóng vai tester kiểm tra toàn bộ website. (Giữa chừng hỏi: Turnstile đã làm chưa?)

**Kết quả**:
- Kiểm thử: quét link/ảnh 14 trang, mở 17 trang ở khung điện thoại; không có link, ảnh hỏng hay tràn ngang. Tìm và sửa 5 lỗi logic (xem BAOCAO mục 3.8b).
- `supabase/qa_fixes.sql`: khách không sửa lịch đã hủy/hoàn thành; đổi ngày giờ lịch đã xác nhận thì quay về "Chờ xác nhận"; khách chỉ hủy được lịch đang chờ/đã xác nhận; hàm `admin_list_customers()`; admin sửa được hồ sơ khách.
- Trang Lịch hẹn: lịch đã hủy, đã qua ngày không còn nút sửa/hủy; cảnh báo khi đổi lịch đã xác nhận; chặn giờ đã qua; huy hiệu chỉ đếm lịch sắp tới.
- Quản trị: nút sửa lịch ngay trong bảng; tab Khách hàng (tìm kiếm, sửa họ tên và số điện thoại, không xóa tài khoản trên web); thanh trên hiện "Quản trị viên" thay vì email.
- Vai trò: giữ một vai trò quản trị (tiệm nhỏ); đề xuất Chủ tiệm / Lễ tân / Thợ trong hướng phát triển.
- Đưa đón: nút "Tìm địa chỉ" hiện tối đa 5 địa chỉ gợi ý trong TP.HCM để khách chọn, hiện tên địa chỉ đã chọn cùng khoảng cách; chỉnh tọa độ tiệm theo hẻm 177 Tôn Thất Thuyết. Thử: "92 Nguyễn Hữu Cảnh" ra Kova Center, Saigon Pearl…; đoạn Khu phố 17 cách 5,9 km, phí 30.000đ.
- Turnstile: code đã sẵn, đang chờ Site key.
- Sau khi người dùng chạy `qa_fixes.sql`: phiên khách gọi `admin_list_customers` bị chặn ("Chỉ quản trị viên được xem danh sách khách hàng"); lịch thử gửi kèm status "confirmed" vẫn lưu thành "pending"; khách tự đổi trạng thái bị chặn; khách đổi giờ lịch đang chờ thì được; khách hủy lịch đang chờ thì được; khách ẩn danh gửi đánh giá bị chặn. Cột `reviews.booking_id`, `photo_url`, `bookings.end_date`, `diet`, `medication` đều có trên database. Đã xóa lịch thử.
