-- Nâng cấp lần 2 (chạy một lần trong Supabase > SQL Editor, chạy lại cũng không sao).
-- 1) Chỉ khách đã dùng dịch vụ mới được đánh giá
-- 2) Ảnh bé trong đánh giá (Supabase Storage)
-- 3) Realtime cho trang Quản trị

-- ===================== 1) LUẬT ĐÁNH GIÁ =====================

-- Mỗi đánh giá gắn với một lịch hẹn; mỗi lịch hẹn chỉ được đánh giá một lần.
-- Đánh giá cũ (trước khi có luật) để booking_id trống, coi như lễ tân nhập từ khách quen.
alter table public.reviews add column if not exists booking_id bigint references public.bookings(id) on delete set null;
alter table public.reviews add column if not exists photo_url text;
create unique index if not exists reviews_booking_once on public.reviews(booking_id) where booking_id is not null;

do $$ begin
  alter table public.reviews add constraint reviews_photo_url_check
    check (photo_url is null or photo_url like 'https://%/storage/v1/object/public/review-photos/%');
exception when duplicate_object then null; end $$;

-- Khách được đánh giá khi: có tài khoản email (không phải ẩn danh), lịch hẹn là của mình,
-- đúng gói dịch vụ, và lễ tân đã chuyển lịch sang "Hoàn thành" (done).
create or replace function public.can_review(p_booking_id bigint, p_service_id integer)
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
     and exists (
       select 1 from public.bookings b
       where b.id = p_booking_id
         and b.user_id = auth.uid()
         and b.service_id = p_service_id
         and b.status = 'done'
     );
$$;

drop policy if exists "reviews: gửi đánh giá" on public.reviews;
create policy "reviews: gửi đánh giá" on public.reviews
  for insert to authenticated
  with check (user_id = auth.uid() and booking_id is not null and public.can_review(booking_id, service_id));

-- Lịch đã hoàn thành là lịch sử dịch vụ: khách không sửa, không xóa được (admin vẫn được).
create or replace function public.bookings_guard()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    if tg_op = 'INSERT' then
      new.status := 'pending';
    elsif old.status = 'done' then
      raise exception 'Lịch hẹn đã hoàn thành, không sửa được';
    elsif new.status is distinct from old.status then
      raise exception 'Chỉ quản trị viên được đổi trạng thái lịch hẹn';
    end if;
  end if;
  return new;
end;
$$;

drop policy if exists "bookings: hủy lịch của mình" on public.bookings;
create policy "bookings: hủy lịch của mình" on public.bookings
  for delete to authenticated using (user_id = auth.uid() and status <> 'done');

-- ===================== 2) ẢNH BÉ TRONG ĐÁNH GIÁ =====================

-- Bucket công khai để ai cũng xem được ảnh; giới hạn 2 MB, chỉ nhận ảnh.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('review-photos', 'review-photos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 2097152,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- Chỉ tài khoản email được tải ảnh, và chỉ vào thư mục mang id của chính mình: <user_id>/<tên file>
drop policy if exists "review-photos: khách tải ảnh" on storage.objects;
create policy "review-photos: khách tải ảnh" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'review-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

drop policy if exists "review-photos: admin xóa ảnh" on storage.objects;
create policy "review-photos: admin xóa ảnh" on storage.objects
  for delete to authenticated using (bucket_id = 'review-photos' and public.is_admin());

-- ===================== 3) REALTIME CHO QUẢN TRỊ =====================

-- Trang Quản trị nhận lịch hẹn mới ngay lập tức (vẫn tuân theo RLS: chỉ admin thấy mọi lịch).
do $$ begin
  alter publication supabase_realtime add table public.bookings;
exception when duplicate_object then null; end $$;
