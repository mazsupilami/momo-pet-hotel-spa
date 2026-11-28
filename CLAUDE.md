# CLAUDE.md — Hướng dẫn cho AI khi làm việc trong dự án

File này được Claude Code tự đọc ở đầu mỗi phiên làm việc.

## Dự án

Website thương hiệu hư cấu **Momo Pet Hotel & Spa** (khách sạn và spa thú cưng), bài thi cuối khóa AI Vibe Coding. Hạn nộp 29/11/2026.

## Đọc trước khi code

- `PRD.md`: website cần làm gì.
- `DESIGN.md`: màu, font, thành phần giao diện.
- `DATABASE.md`: bảng, cột, hàm truy vấn.

## Quy tắc

- HTML, CSS, JavaScript thuần. Không dùng framework, không có bước build.
- Mọi đường dẫn là **tương đối** (`assets/...`, `about.html`), vì website chạy trên GitHub Pages dưới `/tên-repo/`.
- Các trang cho khách dùng chung một header và footer, có đủ link tới các trang (kể cả link "Quản trị" ở footer). Trang Quản trị có header/footer riêng (không có menu khách, nút đặt lịch, nút gọi), chỉ có link "Xem website".
- Chỉ có **một** trang đăng nhập (`login.html`) cho cả khách và admin; đăng ký ở `register.html`, quên mật khẩu ở `forgot-password.html`, đặt lại mật khẩu ở `reset-password.html`. Sau khi đăng nhập, admin vào `admin.html`, khách vào `account.html`. Vào `admin.html` khi chưa đăng nhập sẽ được chuyển về `login.html?next=admin`.
- Mọi ô mật khẩu có nút mắt hiện/ẩn (`.pw-wrap` + `.pw-toggle`, dùng `pw_field()` trong `tools/gen_pages.py` hoặc `pwField()` trong `app.js`). Header và footer sinh từ cùng một mẫu, sửa một trang thì sửa tất cả.
- Tài khoản admin không thấy form đặt lịch và form đánh giá của khách; admin tạo lịch hộ khách ở tab "Tạo lịch hẹn" (`admin.html#tao-lich`).
- Khi đổi CSS hoặc JS, tăng số `?v=` trong thẻ `<link>`/`<script>` để trình duyệt không dùng bản cũ.
- Chỉ dùng logo trong `assets/img/`. Không vẽ logo mới. Ảnh thật của chú chó Momo chỉ dùng ở trang Về chúng tôi; các trang khác dùng ảnh dịch vụ từ Unsplash/Pexels.
- Footer chỉ ghi "© 2026 Momo Pet Hotel & Spa", không ghi nguồn ảnh hay chữ "bài thi".
- Liên hệ: Zalo `https://zalo.me/0968198406`, Messenger `https://m.me/61597136690392` (hằng số `ZALO`, `MESSENGER` trong `tools/gen_pages.py`).
- Số điện thoại luôn là link `tel:`; không tự đổi sang Zalo. Thanh dọc chỉ có Zalo, Messenger, Gọi; Facebook, Instagram, YouTube chỉ ở footer.
- Bài cẩm nang nằm trong `data/articles.json` (slug, title, category, date, image, excerpt, content). Thêm bài mới thì thêm vào file này, không tạo trang HTML mới.
- Icon dùng `assets/img/icons.svg?v=…#tên`; khi thêm icon mới vào sprite, tăng số `?v=` trong `ic()` của `tools/gen_pages.py`, `app.js`, `chatbot.js`.
- Chatbot nằm ở `assets/js/chatbot.js`, trả lời theo từ khóa và đọc giá qua `DB.getServices()`; không gắn vào trang Quản trị.
- Ảnh dịch vụ, cơ sở vật chất, khách hàng là ảnh thật trong `assets/img/photos/` (xem `DESIGN.md` mục 7). Không thay bằng icon hay hình vẽ.
- Không đưa mật khẩu database hay khóa secret vào bất kỳ file nào trong folder này.
- Mọi truy vấn database đi qua `assets/js/db.js`.
- Nội dung do khách nhập (tên, ghi chú, đánh giá) phải qua hàm `esc()` trước khi đưa vào HTML.
- Giao diện và nội dung bằng tiếng Việt.
- Sau mỗi prompt của người dùng, ghi thêm một mục vào `PROMPTS.md`.

## Sửa giao diện

Các trang `.html` được sinh bởi `tools/gen_pages.py` (header, footer, nội dung). Sửa file này rồi chạy `python tools/gen_pages.py`, không sửa tay từng trang.

## Chạy thử

```bash
python -m http.server 8000
```

Mở http://localhost:8000
