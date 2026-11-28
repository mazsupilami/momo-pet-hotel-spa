# DATABASE — Thiết kế cơ sở dữ liệu

File này mô tả các bảng trên **Supabase** và cách website đọc, ghi dữ liệu. AI đọc file này khi viết code truy vấn để dùng đúng tên bảng, tên cột.

Mã tạo bảng nằm ở `supabase/schema.sql`. Dữ liệu dịch vụ gốc nằm ở `data/services.csv`.

## 1. Các bảng

### `services` — gói dịch vụ
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | integer | Khóa chính |
| name | text | Tên gói |
| category | text | Spa, Khách sạn, Combo, Tại nhà |
| price | integer | Giá, đơn vị đồng |
| unit | text | lần, đêm, ngày |
| duration | text | Thời lượng |
| short_desc | text | Mô tả một dòng |
| description | text | Mô tả đầy đủ |
| includes | text | Các hạng mục, ngăn cách bằng dấu `\|` |
| image_url | text | Đường dẫn hình tương đối |
| color | text | Màu nền hình |
| is_featured | boolean | Hiện ở Trang chủ |

### `bookings` — lịch hẹn
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | bigint | Khóa chính, tự tăng |
| user_id | uuid | Mặc định `auth.uid()` |
| service_id | integer | Tham chiếu `services.id` |
| owner_name | text | Tên chủ nuôi |
| phone | text | Số điện thoại |
| pet_name | text | Tên thú cưng |
| pet_type | text | Chó, Mèo, Khác |
| pet_weight | numeric(4,1) | Cân nặng (kg) |
| booking_date | date | Ngày hẹn |
| booking_time | time | Giờ hẹn |
| note | text | Ghi chú, tối đa 300 ký tự |
| status | text | `pending` (chờ xác nhận), `confirmed`, `done`, `cancelled`. Chỉ admin đổi được (trigger `bookings_guard`) |
| created_at, updated_at | timestamptz | |

Cột thêm ở `stay_dates.sql`: `end_date` (ngày trả bé, trống với gói theo lần; từ `booking_date` đến tối đa 30 ngày sau), `diet` (≤100 ký tự), `medication` (≤150 ký tự). Số đêm = `end_date - booking_date` (khách sạn); số ngày = `end_date - booking_date + 1` (trông giữ).

### `profiles` — hồ sơ khách có tài khoản
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | uuid | Khóa chính, trùng `auth.users.id` |
| full_name | text | Họ tên, tối đa 60 ký tự |
| phone | text | Số điện thoại |
| created_at, updated_at | timestamptz | |

### `admins` — quản trị viên
| Cột | Kiểu | Ghi chú |
|---|---|---|
| user_id | uuid | Khóa chính, tham chiếu `auth.users.id` |

Hàm `is_admin()` trả về `true` nếu người đang đăng nhập có trong bảng này.

### `reviews` — đánh giá

Cột thêm ở `features_v2.sql`: `booking_id` (lịch hẹn đã hoàn thành, mỗi lịch một đánh giá), `photo_url` (ảnh trong bucket `review-photos`).
| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | bigint | Khóa chính, tự tăng |
| user_id | uuid | Mặc định `auth.uid()` |
| service_id | integer | Tham chiếu `services.id` |
| author_name | text | Tối đa 60 ký tự |
| rating | integer | Từ 1 đến 5 |
| comment | text | Tối đa 500 ký tự |
| created_at | timestamptz | |

## 2. Chức năng và thao tác

| Chức năng | Thao tác | Hàm trong `assets/js/db.js` |
|---|---|---|
| Xem dịch vụ, bảng giá | select `services` | `DB.getServices`, `DB.getService` |
| Đặt lịch hẹn | **insert** `bookings` | `DB.createBooking` |
| Xem lịch của tôi | select `bookings` | `DB.getMyBookings` |
| Sửa ngày giờ, cân nặng | **update** `bookings` | `DB.updateBooking` |
| Hủy lịch hẹn | **delete** `bookings` | `DB.deleteBooking` |
| Gửi đánh giá | **insert** `reviews` | `DB.addReview` |
| Xem đánh giá | select `reviews` | `DB.getReviews` |
| Chatbot báo giá, bảng giá theo cân nặng | select `services` | `DB.getServices` |
| Đăng ký, đăng nhập, đăng xuất | Supabase Auth | `DB.signUp`, `DB.signIn`, `DB.signOut` |
| Sửa thông tin tài khoản | **insert / update** `profiles` | `DB.saveProfile` |
| Đổi mật khẩu | Supabase Auth | `DB.changePassword` |
| Gửi email khôi phục mật khẩu | Supabase Auth | `DB.sendPasswordReset` |
| Admin: xem mọi lịch hẹn | select `bookings` | `DB.adminGetBookings` |
| Admin: tạo lịch hộ khách | **insert** `bookings` | `DB.adminCreateBooking` |
| Admin: đổi trạng thái lịch | **update** `bookings` | `DB.adminSetStatus` |
| Admin: xóa lịch hẹn | **delete** `bookings` | `DB.adminDeleteBooking` |
| Admin: sửa giá, dịch vụ nổi bật | **update** `services` | `DB.adminUpdateService` |
| Admin: xóa đánh giá | **delete** `reviews` | `DB.adminDeleteReview` |

## 3. Bảo mật

- **Khách không bắt buộc đăng nhập.** Lần đầu đặt lịch, website gọi `signInAnonymously()` để Supabase cấp một phiên ẩn danh cho trình duyệt.
- **Tạo tài khoản**: nếu khách đang có phiên ẩn danh, website nâng cấp chính phiên đó thành tài khoản email (`updateUser`), nên các lịch hẹn đã đặt được giữ lại.
- **Đăng nhập chung một cửa**: khách và quản trị viên dùng cùng form đăng nhập ở `account.html` (cùng bảng `auth.users`). Vai trò quyết định bằng bảng `admins`: admin đăng nhập xong được chuyển sang `admin.html`, khách ở lại trang Tài khoản. Quyền quản trị kiểm tra bằng hàm `is_admin()` trong database, không dựa vào giao diện, nên khách có mở `admin.html` cũng không đọc hay sửa được dữ liệu của người khác.


- Mọi bảng bật Row Level Security. Khách chỉ xem, sửa, hủy được lịch hẹn của chính mình (`user_id = auth.uid()`).
- `services` và `reviews` ai cũng đọc được.
- Khóa `anon` trong `assets/js/config.js` là khóa công khai theo thiết kế của Supabase.
- Hệ quả: lịch hẹn gắn với trình duyệt đã đặt. Mở bằng trình duyệt khác sẽ không thấy lịch cũ.

## 4. Cài đặt Supabase

1. Tạo project tại supabase.com.
2. **SQL Editor**: dán nội dung `supabase/schema.sql`, bấm Run.
3. **Authentication > Sign In / Providers**: bật **Allow anonymous sign-ins**, rồi bấm **Save changes** ở cuối trang. Kiểm tra: mở `https://<project>.supabase.co/auth/v1/settings?apikey=<khóa publishable>`, dòng `"anonymous_users"` phải là `true`.
4. **Project Settings > API**: chép Project URL và khóa publishable (anon) vào `assets/js/config.js`.
5. Nếu bảng `services` được tạo trước khi có ảnh thật, chạy thêm `supabase/update_images.sql`.
6. **SQL Editor**: chạy `supabase/add_home_services.sql` để thêm 2 gói dịch vụ tại nhà (id 10, 11).
6b. **SQL Editor**: chạy `supabase/auth_admin.sql` (bảng `profiles`, `admins`, cột `status`, quyền quản trị).
7. **Authentication > Sign In / Providers > Email**: tắt **Confirm email** để khách đăng ký xong dùng được ngay (bản demo không gửi email).
8. **Tạo tài khoản admin**: Authentication > Users > Add user > Create new user (tích Auto Confirm User). Sau đó chạy câu lệnh cuối file `auth_admin.sql` với email vừa tạo.
9. **Khôi phục mật khẩu**: Authentication > URL Configuration. Đặt **Site URL** là địa chỉ website (khi chạy máy là `http://localhost:8000`, khi deploy là link GitHub Pages). Ở **Redirect URLs** thêm `http://localhost:8000/**` và link GitHub Pages kèm `/**`. Nếu thiếu, liên kết trong email sẽ mở sai địa chỉ.
   - Supabase gói miễn phí dùng máy chủ email mặc định: chỉ gửi tới email của thành viên trong project và giới hạn vài email mỗi giờ. Muốn gửi cho khách bất kỳ cần cấu hình SMTP riêng (Authentication > Emails > SMTP Settings).

10. **Chatbot AI (tùy chọn)**:
    - Lấy khóa ở Google AI Studio (aistudio.google.com) > Get API key > Create API key. Không bật thanh toán để giữ ở gói miễn phí.
    - Supabase > Edge Functions > Secrets: thêm `GEMINI_API_KEY` (tùy chọn `GEMINI_MODEL`, mặc định `gemini-flash-lite-latest`).
    - Edge Functions > Deploy a new function > Via Editor: tên `chat`, dán nội dung `supabase/functions/chat/index.ts`, Deploy. Supabase có thể tự đặt địa chỉ (slug) khác tên, ví dụ `bright-service`: chép slug ở cột URL vào `CHAT_FUNCTION` trong `assets/js/config.js`.
    - Tên secret phải đúng chính xác `GEMINI_API_KEY` (viết hoa, gạch dưới).
    - Trong function `chat`: tắt **Verify JWT** (website gửi khóa publishable, không phải JWT). Function chỉ nhận yêu cầu từ link GitHub Pages và localhost:8000.
    - Chưa làm bước này thì chatbot vẫn chạy bằng luật từ khóa.

11. **Nâng cấp lần 2**: chạy `supabase/features_v2.sql` (luật đánh giá, cột `booking_id` và `photo_url` của `reviews`, bucket ảnh `review-photos`, Realtime cho `bookings`).
12. **Báo lịch mới qua Telegram**:
    - Telegram: nhắn @BotFather lệnh `/newbot`, đặt tên, nhận mã bot (token).
    - Nhắn một tin bất kỳ cho bot vừa tạo, rồi mở `https://api.telegram.org/bot<token>/getUpdates`, chép số `"chat":{"id": ...}`.
    - Supabase > Edge Functions > Secrets: thêm `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `WEBHOOK_SECRET` (chuỗi tự đặt).
    - Deploy function `notify-booking` (dán `supabase/functions/notify-booking/index.ts`), tắt **Verify JWT**.
    - Tạo webhook bằng SQL: mở `supabase/booking_webhook.sql`, trong SQL Editor thay `DAN_WEBHOOK_SECRET_VAO_DAY` bằng giá trị `WEBHOOK_SECRET`, Run. File dùng `pg_net` gọi function và lưu chuỗi bí mật trong Supabase Vault. (Cách khác: Integrations > Database Webhooks trên giao diện.)
13. **Chống spam (Cloudflare Turnstile)**:
    - Cloudflare > Turnstile > Add site: tên miền `mazsupilami.github.io` và `localhost`, chế độ Managed.
    - Chép **Site key** vào `TURNSTILE_SITE_KEY` trong `assets/js/config.js` và deploy website trước.
    - Sau đó Supabase > Authentication > Attack Protection: bật CAPTCHA, chọn Turnstile, dán **Secret key**.

14. **Lưu trú nhiều ngày**: chạy `supabase/stay_dates.sql`. Chưa chạy thì website vẫn đặt được lịch, ngày trả bé được ghi vào ghi chú.

**Không đưa mật khẩu database lên GitHub.** Mật khẩu chỉ dùng để đăng nhập Supabase, website không cần đến. File ghi chú chứa mật khẩu để ngoài folder dự án và đã được liệt kê trong `.gitignore`.
