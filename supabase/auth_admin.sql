-- Momo Pet Hotel & Spa — tài khoản khách, quản trị viên, trạng thái lịch hẹn
-- Chạy SAU schema.sql. Supabase Dashboard > SQL Editor > dán toàn bộ file > Run.
-- Chạy lại nhiều lần vẫn an toàn.

-- 1) HỒ SƠ KHÁCH ----------------------------------------------------------

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text check (full_name is null or char_length(full_name) <= 60),
  phone      text check (phone is null or char_length(phone) between 8 and 15),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) QUẢN TRỊ VIÊN ---------------------------------------------------------

create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- 3) TRẠNG THÁI LỊCH HẸN ----------------------------------------------------

alter table public.bookings
  add column if not exists status text not null default 'pending';

do $$ begin
  alter table public.bookings add constraint bookings_status_check
    check (status in ('pending', 'confirmed', 'done', 'cancelled'));
exception when duplicate_object then null;
end $$;

-- Khách không tự đổi được trạng thái; chỉ quản trị viên được đổi.
create or replace function public.bookings_guard()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    if tg_op = 'INSERT' then
      new.status := 'pending';
    elsif new.status is distinct from old.status then
      raise exception 'Chỉ quản trị viên được đổi trạng thái lịch hẹn';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_guard on public.bookings;
create trigger bookings_guard
  before insert or update on public.bookings
  for each row execute function public.bookings_guard();

-- 4) BẢO MẬT (Row Level Security) -----------------------------------------

alter table public.profiles enable row level security;
alter table public.admins   enable row level security;

drop policy if exists "profiles: xem hồ sơ" on public.profiles;
create policy "profiles: xem hồ sơ" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles: tạo hồ sơ của mình" on public.profiles;
create policy "profiles: tạo hồ sơ của mình" on public.profiles
  for insert to authenticated with check (id = auth.uid());

drop policy if exists "profiles: sửa hồ sơ của mình" on public.profiles;
create policy "profiles: sửa hồ sơ của mình" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "admins: tự kiểm tra quyền" on public.admins;
create policy "admins: tự kiểm tra quyền" on public.admins
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "bookings: admin xem tất cả" on public.bookings;
create policy "bookings: admin xem tất cả" on public.bookings
  for select to authenticated using (public.is_admin());

drop policy if exists "bookings: admin sửa" on public.bookings;
create policy "bookings: admin sửa" on public.bookings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "bookings: admin xóa" on public.bookings;
create policy "bookings: admin xóa" on public.bookings
  for delete to authenticated using (public.is_admin());

drop policy if exists "services: admin sửa" on public.services;
create policy "services: admin sửa" on public.services
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reviews: admin xóa" on public.reviews;
create policy "reviews: admin xóa" on public.reviews
  for delete to authenticated using (public.is_admin());

-- 5) CẤP QUYỀN QUẢN TRỊ ------------------------------------------------------
-- B1. Authentication > Users > Add user > Create new user:
--     nhập email và mật khẩu cho tài khoản admin, tích "Auto Confirm User".
-- B2. Thay email bên dưới bằng email vừa tạo, bỏ dấu "--" ở đầu dòng, rồi Run.

-- insert into public.admins (user_id)
-- select id from auth.users where email = 'admin@example.com'
-- on conflict do nothing;
