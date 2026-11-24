# Momo Pet Hotel & Spa

Website giới thiệu dịch vụ và đặt lịch của thương hiệu hư cấu **Momo Pet Hotel & Spa**, khách sạn và spa chăm sóc thú cưng. Bài thi cuối khóa AI Vibe Coding.

![Logo Momo Pet Hotel & Spa](assets/img/logo.svg)

- **Website**: https://mazsupilami.github.io/momo-pet-hotel-spa/
- **Facebook**: https://www.facebook.com/profile.php?id=61597136690392
- **Báo cáo**: [BAOCAO.md](BAOCAO.md)

## Công nghệ

- HTML, CSS, JavaScript thuần
- Supabase (PostgreSQL) làm database
- GitHub Pages để deploy

## Cấu trúc

```
index.html         Trang chủ
about.html         Về chúng tôi (cơ sở vật chất, bảng giá)
services.html      Danh sách dịch vụ
service.html       Chi tiết dịch vụ, đặt lịch, đánh giá
bookings.html      Lịch hẹn của tôi (sửa, hủy)
login.html         Đăng nhập (khách và admin)
register.html      Đăng ký tài khoản khách
forgot-password.html  Quên mật khẩu (gửi email)
reset-password.html   Đặt lại mật khẩu từ email
account.html       Tài khoản của tôi (hồ sơ, đổi mật khẩu)
admin.html         Trang quản trị
contact.html       Liên hệ, Google Map
assets/css         Giao diện
assets/js          config.js, db.js, app.js
assets/img         Logo, bộ icon (icons.svg) và ảnh (photos/)
data/services.csv  Dữ liệu dịch vụ gốc
supabase/schema.sql  Mã tạo bảng và quy tắc bảo mật
supabase/update_images.sql  Đổi hình dịch vụ sang ảnh thật
supabase/auth_admin.sql     Tài khoản khách, quản trị viên, trạng thái lịch hẹn
tools/gen_pages.py          Sinh 8 trang HTML từ một mẫu header/footer chung
```

## Các file .md

| File | Tác dụng |
|---|---|
| `PRD.md` | Yêu cầu sản phẩm: thương hiệu, các trang, chức năng |
| `DESIGN.md` | Quy chuẩn giao diện: màu, font, thành phần |
| `DATABASE.md` | Thiết kế bảng và cách cài Supabase |
| `CLAUDE.md` | Quy tắc cho AI khi code trong dự án |
| `PROMPTS.md` | Nhật ký prompt và kết quả |
| `BAOCAO.md` | Báo cáo nộp giảng viên |
| `README.md` | Giới thiệu dự án |

## Chạy trên máy

```bash
python -m http.server 8000
```

Mở http://localhost:8000. Cách cài Supabase xem `DATABASE.md` mục 4.
