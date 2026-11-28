-- Lưu trú nhiều ngày (khách sạn theo đêm, trông giữ theo ngày).
-- Chạy một lần trong Supabase > SQL Editor (chạy lại cũng không sao).

-- end_date: ngày trả bé. Để trống với các gói spa (theo lần).
--   Khách sạn: số đêm = end_date - booking_date (ít nhất 1 đêm).
--   Trông giữ: số ngày = end_date - booking_date + 1.
alter table public.bookings add column if not exists end_date date;
-- Chế độ ăn và thuốc đang dùng (dành cho khách sạn, trông giữ)
alter table public.bookings add column if not exists diet text;
alter table public.bookings add column if not exists medication text;

do $$ begin
  alter table public.bookings add constraint bookings_end_date_check
    check (end_date is null or (end_date >= booking_date and end_date <= booking_date + 30));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.bookings add constraint bookings_diet_check
    check (diet is null or char_length(diet) <= 100);
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.bookings add constraint bookings_medication_check
    check (medication is null or char_length(medication) <= 150);
exception when duplicate_object then null; end $$;
