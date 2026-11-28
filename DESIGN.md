# DESIGN — Quy chuẩn giao diện Momo Pet Hotel & Spa

File này trả lời câu hỏi **"website trông như thế nào"**. AI đọc file này mỗi khi tạo hoặc sửa giao diện, để mọi trang cùng màu, cùng font, cùng kiểu thành phần.

## 1. Định hướng

**Thương mại, chuyên nghiệp, đáng tin.** Website phải giống một doanh nghiệp dịch vụ thú cưng thật đang nhận khách:

- Ảnh chụp thật ở mọi nơi có thể; không dùng hình vẽ thay ảnh.
- Hotline và nút "Đặt lịch" luôn hiện trên header; nút gọi nổi ở góc phải dưới.
- Giá niêm yết rõ trên từng thẻ dịch vụ.
- Có các yếu tố tạo niềm tin: số liệu, đánh giá khách hàng, quy trình 4 bước, chính sách, hỏi đáp.
- Nhiều khoảng trống, chữ đậm rõ, bo góc vừa phải (12–24px), không lạm dụng màu.

## 2. Màu sắc

Khai báo trong `:root` của `assets/css/style.css`. Không viết mã màu trực tiếp ở nơi khác.

| Biến | Mã | Dùng cho |
|---|---|---|
| `--brand` | `#0E7C7B` | Màu thương hiệu (xanh ngọc): icon, link, nút phụ |
| `--brand-dark` | `#0A5E5D` | Rê chuột vào nút brand |
| `--accent` | `#F28C38` | Nút hành động chính (Đặt lịch), giá tiền |
| `--ink` | `#14213D` | Chữ chính, thanh trên cùng, footer, banner |
| `--muted` | `#5B6476` | Chữ phụ |
| `--bg` / `--sand` | `#F7F5F0` / `#FBF3E6` | Nền xen kẽ giữa các section |
| `--sun` | `#FFC857` | Điểm nhấn nhỏ trên nền tối |
| `--line` | `#E7E2D8` | Đường viền |

## 3. Chữ

- Một font duy nhất: **Be Vietnam Pro** (400–800), hỗ trợ tiếng Việt đầy đủ, tải từ Google Fonts.
- Tiêu đề weight 800, nội dung 400, cỡ nội dung 16px, giãn dòng 1.65.
- Nhãn nhỏ trên tiêu đề section (`.eyebrow`): chữ in hoa, màu cam, có gạch ngang phía trước.

## 4. Bố cục chung (mọi trang)

1. **Thanh trên cùng** (`.topbar`): địa chỉ, giờ mở cửa, hotline, mạng xã hội.
2. **Header** dính trên cùng: logo, menu 5 mục, hotline, nút "Đặt lịch". Dưới 880px menu thu vào nút ☰.
3. **Đầu trang con** (`.page-hero`): ảnh nền phủ lớp màu `--ink`, đường dẫn (breadcrumb), tiêu đề, mô tả.
4. **Dải kêu gọi** (`.cta-band`) cuối trang: nền xanh ngọc, nút đặt lịch và hotline.
5. **Footer** 4 cột: giới thiệu + mạng xã hội, dịch vụ, liên kết trang, thông tin liên hệ.
6. **Thanh liên hệ dọc** (`.social-rail`) bên trái: Zalo, Messenger, Gọi (`.sr-phone`), vạch ngăn (`.sr-sep`), Facebook, Instagram, YouTube; điện thoại chỉ hiện 3 nút đầu. **Chatbot** (`.chatbot`) góc phải dưới; **nút lên đầu trang** (`.to-top`). Thanh trên cùng chỉ có địa chỉ, giờ mở cửa, hotline. Mạng xã hội ở thanh dọc và footer, không đặt ở thanh trên cùng.
7. Số điện thoại luôn là link `tel:` (gọi). Muốn nhắn Zalo thì dùng nút Zalo riêng, không đổi ngầm số điện thoại thành Zalo.

Chiều rộng nội dung tối đa 1200px, lề hai bên 20px. Lưới dịch vụ 4 cột (trang chủ) hoặc 3 cột (trang dịch vụ), 2 cột trên máy tính bảng, 1 cột trên điện thoại.

## 5. Thành phần

| Lớp CSS | Mô tả |
|---|---|
| `.btn` | Nút chính màu cam, bo 12px |
| `.btn-brand`, `.btn-outline`, `.btn-light`, `.btn-ghost-light`, `.btn-danger` | Các biến thể nút |
| `.hero` | Banner trang chủ: ảnh nằm nửa phải, chữ trên nền `--ink` bên trái |
| `.stats` | Dải 4 số liệu nổi lên mép dưới banner |
| `.svc-card` | Thẻ dịch vụ: ảnh 4:3, nhãn nhóm, tên, mô tả, thời lượng, giá, "Đặt lịch →" |
| `.steps` | Quy trình 4 bước có số thứ tự |
| `.quote` | Thẻ đánh giá khách hàng |
| `.gallery` | Lưới ảnh khách quen có chú thích |
| `.faq` | Hỏi đáp dạng mở rộng (`<details>`) |
| `.info-card` | Thẻ thông tin có icon |
| `.panel` | Khung form đặt lịch, đánh giá |
| `.booking` | Thẻ lịch hẹn: ảnh dịch vụ, trạng thái, thông tin, nút sửa và hủy |
| `.btn-zalo` | Nút xanh Zalo (#0068FF) |
| `.parade`, `.peek`, `.peek-tip` | Dàn thú cưng ló đầu trên thanh đỏ ở Trang chủ. Rê chuột (hoặc Tab) bé nhô lên và hiện chú thích giống, tính cách. Điện thoại hiện 5 bé |
| `.nav-link`, `.nav-item.has-menu`, `.sub-toggle`, `.mega` (`.mega-1/2/3`, `.mega-col`, `.mega-title`, `.mega-card`) | Menu sổ xuống. Máy tính: rê chuột hoặc bấm mũi tên, Esc để đóng, chọn mục thì tự đóng. Điện thoại: bấm mũi tên để gập mở trong menu ☰ |
| `.promo-card`, `.promo-tag` | Thẻ ưu đãi viền nét đứt, nhãn cam (-20%, 10+1, -10%) |
| `.article-card`, `.article-wrap`, `.article-side`, `.related` | Thẻ bài cẩm nang, bố cục bài viết 2 cột (nội dung + cột tư vấn, bài liên quan) |
| `.promo` | Pop-up ưu đãi (trang chủ, mỗi phiên một lần, sau 6 giây) |
| `.reveal` | Hiện dần khi cuộn tới (IntersectionObserver); tắt khi người dùng chọn giảm chuyển động |
| `.chatbot` | Khung chat trợ lý Momo (`assets/js/chatbot.js`) |

## 6. Icon

Bộ icon nét đơn trong `assets/img/icons.svg` (dạng sprite). Cách dùng:

```html
<svg class="i" aria-hidden="true"><use href="assets/img/icons.svg#phone"/></svg>
```

Có sẵn: `phone`, `pin`, `clock`, `mail`, `check`, `star`, `shield`, `camera`, `leaf`, `paw`, `calendar`, `scissors`, `bath`, `home`, `heart`, `arrow`, `chat`, `users`, `facebook`, `instagram`, `youtube`. Không dùng emoji làm icon.

## 7. Logo

- Gương mặt chú chó **Momo** vẽ theo ảnh thật: lông đen vện vàng, chấm vàng trên mắt, một tai dựng một tai cụp, mõm bạc, lè lưỡi, đeo vòng xích bạc; đặt trong vòng tròn xanh ngọc, kèm chữ **MOMO / PET HOTEL & SPA**.
- `logo.svg` cho nền sáng, `logo-light.svg` cho nền tối (footer), `logo-mark.svg` cho favicon và trạng thái trống.
- Luôn dùng file trong `assets/img/`, không vẽ lại, không đổi màu. Chiều cao trên header 48px.

## 8. Ảnh

Ảnh chụp thật trong `assets/img/photos/`, định dạng JPG, rộng tối đa 1400px. Nguồn: Unsplash và Pexels, giấy phép cho phép dùng miễn phí, không bắt buộc ghi nguồn. **Ảnh thật của chú chó Momo chỉ dùng ở trang Về chúng tôi** (ảnh đầu trang `momo-sea.jpg`, ảnh câu chuyện `momo-portrait.jpg`) để khớp với logo; các trang khác dùng ảnh dịch vụ. Dàn thú cưng dùng ảnh chân dung nền sáng trong `photos/parade/`. Mọi ảnh có `alt` tiếng Việt. Ảnh cơ sở vật chất `fac-camera.jpg`, `fac-kitchen.jpg`, `fac-medical.jpg`; ảnh nhân viên (ảnh minh họa Unsplash, tên hư cấu) trong `photos/staff/`. Thẻ đội ngũ dùng `.staff-grid` / `.staff-card`.

| Ảnh | Dùng cho |
|---|---|
| `hero-spa.jpg` | Banner trang chủ |
| `svc-*.jpg`, `room-*.jpg` | Ảnh từng gói dịch vụ (cột `image_url` trong database) |
| `staff-care.jpg`, `team.jpg` | Mục "Vì sao chọn Momo", "Đội ngũ" |
| `owner-hug.jpg`, `owner-woman.jpg`, `golden-portrait.jpg` | Trang Về chúng tôi, Tài khoản, trang đăng nhập, thư viện ảnh |
| `storefront.jpg` | Đầu trang và mục "Cửa hàng" ở trang Liên hệ |
| `saigon-scooter.jpg` | Mục "Ghé thăm cửa hàng" ở trang Về chúng tôi |
| `pet-*.jpg` | Đánh giá khách hàng, thư viện khách quen |
