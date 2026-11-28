-- Sửa lỗi logic sau đợt kiểm thử (chạy một lần trong Supabase > SQL Editor, chạy lại cũng không sao).

-- 1) Luật sửa lịch của khách
--   - Lịch đã hủy hoặc đã hoàn thành: khách không sửa được.
--   - Khách không tự đổi trạng thái.
--   - Khách đổi ngày/giờ của lịch đã xác nhận: lịch quay về "Chờ xác nhận" để lễ tân xác nhận lại.
create or replace function public.bookings_guard()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    if tg_op = 'INSERT' then
      new.status := 'pending';
    elsif old.status in ('done', 'cancelled') then
      raise exception 'Lịch hẹn đã % nên không sửa được', case old.status when 'done' then 'hoàn thành' else 'hủy' end;
    elsif new.status is distinct from old.status then
      raise exception 'Chỉ quản trị viên được đổi trạng thái lịch hẹn';
    elsif old.status = 'confirmed'
      and (new.booking_date, new.booking_time, new.end_date) is distinct from (old.booking_date, old.booking_time, old.end_date) then
      new.status := 'pending';
    end if;
  end if;
  return new;
end;
$$;

-- 2) Khách chỉ hủy (xóa) được lịch đang chờ hoặc đã xác nhận; lịch đã hủy, đã hoàn thành giữ lại làm lịch sử.
drop policy if exists "bookings: hủy lịch của mình" on public.bookings;
create policy "bookings: hủy lịch của mình" on public.bookings
  for delete to authenticated using (user_id = auth.uid() and status in ('pending', 'confirmed'));

-- 3) Danh sách khách hàng cho trang Quản trị (chỉ admin gọi được).
--    Email nằm trong auth.users nên cần hàm security definer; hàm tự kiểm tra quyền admin.
create or replace function public.admin_list_customers()
returns table (
  id uuid,
  email text,
  full_name text,
  phone text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  bookings_count bigint,
  is_admin boolean
)
language plpgsql stable security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Chỉ quản trị viên được xem danh sách khách hàng';
  end if;
  return query
    select u.id, u.email::text, p.full_name, p.phone, u.created_at, u.last_sign_in_at,
           (select count(*) from public.bookings b where b.user_id = u.id),
           exists (select 1 from public.admins a where a.user_id = u.id)
    from auth.users u
    left join public.profiles p on p.id = u.id
    where coalesce(u.is_anonymous, false) = false
    order by u.created_at desc;
end;
$$;

revoke execute on function public.admin_list_customers() from public, anon;
grant execute on function public.admin_list_customers() to authenticated;

-- 4) Admin sửa họ tên, số điện thoại của khách (khi khách gọi nhờ cập nhật).
drop policy if exists "profiles: admin sửa" on public.profiles;
create policy "profiles: admin sửa" on public.profiles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- 5) Admin tạo hồ sơ cho khách chưa có hồ sơ (khách đăng ký nhưng chưa nhập họ tên, số điện thoại).
drop policy if exists "profiles: admin tạo" on public.profiles;
create policy "profiles: admin tạo" on public.profiles
  for insert to authenticated with check (public.is_admin());
