-- Momo Pet Hotel & Spa — schema Supabase
-- Cách dùng: Supabase Dashboard > SQL Editor > dán toàn bộ file này > Run.
-- Chạy lại nhiều lần vẫn an toàn.

-- 1) BẢNG ---------------------------------------------------------------

create table if not exists public.services (
  id          integer primary key,
  name        text not null,
  category    text not null,
  price       integer not null check (price >= 0),
  unit        text not null,
  duration    text,
  short_desc  text,
  description text,
  includes    text,
  image_url   text,
  color       text,
  is_featured boolean not null default false
);

create table if not exists public.bookings (
  id           bigint generated always as identity primary key,
  user_id      uuid not null default auth.uid(),
  service_id   integer not null references public.services(id),
  owner_name   text not null check (char_length(owner_name) between 1 and 60),
  phone        text not null check (char_length(phone) between 8 and 15),
  pet_name     text not null check (char_length(pet_name) between 1 and 40),
  pet_type     text not null check (pet_type in ('Chó', 'Mèo', 'Khác')),
  pet_weight   numeric(4,1) not null check (pet_weight > 0 and pet_weight <= 99),
  booking_date date not null,
  booking_time time not null,
  note         text check (note is null or char_length(note) <= 300),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.reviews (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid(),
  service_id  integer not null references public.services(id) on delete cascade,
  author_name text not null check (char_length(author_name) between 1 and 60),
  rating      integer not null check (rating between 1 and 5),
  comment     text not null check (char_length(comment) between 1 and 500),
  created_at  timestamptz not null default now()
);

-- 2) BẢO MẬT (Row Level Security) ---------------------------------------

alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews  enable row level security;

drop policy if exists "services: ai cũng xem được" on public.services;
create policy "services: ai cũng xem được" on public.services
  for select to anon, authenticated using (true);

drop policy if exists "bookings: xem lịch của mình" on public.bookings;
create policy "bookings: xem lịch của mình" on public.bookings
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "bookings: đặt lịch" on public.bookings;
create policy "bookings: đặt lịch" on public.bookings
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "bookings: sửa lịch của mình" on public.bookings;
create policy "bookings: sửa lịch của mình" on public.bookings
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "bookings: hủy lịch của mình" on public.bookings;
create policy "bookings: hủy lịch của mình" on public.bookings
  for delete to authenticated using (user_id = auth.uid());

drop policy if exists "reviews: ai cũng xem được" on public.reviews;
create policy "reviews: ai cũng xem được" on public.reviews
  for select to anon, authenticated using (true);

drop policy if exists "reviews: gửi đánh giá" on public.reviews;
create policy "reviews: gửi đánh giá" on public.reviews
  for insert to authenticated with check (user_id = auth.uid());

-- 3) DỮ LIỆU MẪU (giống data/services.csv) -------------------------------

insert into public.services (id, name, category, price, unit, duration, short_desc, description, includes, image_url, color, is_featured) values
(1, 'Tắm gội & sấy thơm', 'Spa', 150000, 'lần', '60 phút', 'Sạch thơm trong một giờ', 'Tắm bằng sữa tắm thảo dược dịu nhẹ, sấy khô từng lớp lông và chải mượt. Phù hợp cho chó mèo mọi giống.', 'Sữa tắm thảo dược|Sấy khô và chải lông|Xịt dưỡng thơm|Kiểm tra da cơ bản', 'assets/img/photos/svc-bath.jpg', '#3BB4A8', true),
(2, 'Cắt tỉa tạo kiểu', 'Spa', 280000, 'lần', '90 phút', 'Kiểu lông theo ý bạn', 'Thợ cắt tỉa tư vấn kiểu phù hợp với giống và dáng của bé, cắt bằng kéo và tông đơ êm tiếng.', 'Tư vấn kiểu lông|Cắt tỉa toàn thân|Tỉa lông mặt và bàn chân|Chụp ảnh trước và sau', 'assets/img/photos/svc-groom.jpg', '#FF8A5B', true),
(3, 'Spa thư giãn toàn thân', 'Spa', 420000, 'lần', '120 phút', 'Massage và ủ dưỡng lông', 'Liệu trình tắm sục bọt mịn, massage thư giãn và ủ dưỡng lông bằng dầu dừa hữu cơ.', 'Tắm sục bọt mịn|Massage 20 phút|Ủ dưỡng lông dầu dừa|Cắt móng và vệ sinh tai', 'assets/img/photos/svc-relax.jpg', '#8E7CC3', false),
(4, 'Vệ sinh tai, móng, tuyến hôi', 'Spa', 90000, 'lần', '30 phút', 'Chăm sóc nhanh định kỳ', 'Gói chăm sóc nhanh nên làm mỗi 3 đến 4 tuần để bé luôn khỏe và sạch.', 'Cắt và mài móng|Vệ sinh tai|Vắt tuyến hôi|Vệ sinh mắt', 'assets/img/photos/svc-nails.jpg', '#F2B632', false),
(5, 'Phòng Tiêu chuẩn', 'Khách sạn', 180000, 'đêm', 'Qua đêm', 'Ấm cúng và sạch sẽ', 'Phòng riêng 1 m² có nệm, máy lạnh trung tâm và ba bữa ăn theo khẩu phần bạn gửi.', 'Phòng riêng 1 m²|Máy lạnh 24/7|Dắt đi dạo 2 lần mỗi ngày|Báo cáo qua Zalo mỗi tối', 'assets/img/photos/room-standard.jpg', '#3BB4A8', false),
(6, 'Phòng Deluxe', 'Khách sạn', 280000, 'đêm', 'Qua đêm', 'Rộng hơn và có sân chơi', 'Phòng 2 m² có giường nệm cao, đồ chơi riêng và một giờ vui chơi ở sân cỏ mỗi ngày.', 'Phòng riêng 2 m²|Đồ chơi và giường nệm|Sân chơi 1 giờ mỗi ngày|Ảnh và video mỗi ngày', 'assets/img/photos/room-deluxe.jpg', '#F2B632', false),
(7, 'Phòng VIP có camera', 'Khách sạn', 450000, 'đêm', 'Qua đêm', 'Xem bé 24/7 qua điện thoại', 'Phòng kính 4 m² có camera riêng, máy lọc không khí và nhân viên chăm sóc một kèm một.', 'Phòng kính 4 m²|Camera xem trực tiếp 24/7|Máy lọc không khí|Tặng một lần tắm gội khi trả phòng', 'assets/img/photos/room-vip.jpg', '#FF8A5B', true),
(8, 'Combo Tắm và Cắt tỉa', 'Combo', 390000, 'lần', '150 phút', 'Tiết kiệm 40.000đ', 'Kết hợp gói Tắm gội & sấy thơm với Cắt tỉa tạo kiểu trong một lần hẹn.', 'Toàn bộ gói Tắm gội|Toàn bộ gói Cắt tỉa|Cắt móng miễn phí|Nơ hoặc khăn cổ tặng kèm', 'assets/img/photos/svc-combo.jpg', '#8E7CC3', true),
(9, 'Trông giữ ban ngày', 'Combo', 120000, 'ngày', '8:00 đến 18:00', 'Gửi bé khi bạn đi làm', 'Bé được vui chơi cùng bạn bè trong sân có giám sát, ăn trưa và ngủ trưa đúng giờ.', 'Sân chơi có giám sát|Bữa trưa theo khẩu phần|Giờ ngủ trưa|Ảnh cập nhật giữa ngày', 'assets/img/photos/svc-daycare.jpg', '#3BB4A8', false)
on conflict (id) do update set
  name = excluded.name, category = excluded.category, price = excluded.price, unit = excluded.unit,
  duration = excluded.duration, short_desc = excluded.short_desc, description = excluded.description,
  includes = excluded.includes, image_url = excluded.image_url, color = excluded.color,
  is_featured = excluded.is_featured;
