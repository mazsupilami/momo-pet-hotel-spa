-- Webhook báo lịch hẹn mới qua Telegram (thay cho Database > Webhooks trên giao diện).
-- Mỗi khi bảng bookings có dòng mới, database gọi Edge Function "notify-booking".
--
-- CÁCH CHẠY: dán file này vào Supabase > SQL Editor, thay DAN_WEBHOOK_SECRET_VAO_DAY bằng đúng chuỗi
-- WEBHOOK_SECRET đã lưu trong Edge Functions > Secrets, rồi bấm Run.
-- KHÔNG lưu chuỗi bí mật vào file này trong repo: chỉ thay trong SQL Editor.

create extension if not exists pg_net;

-- Lưu chuỗi bí mật trong Supabase Vault (mã hóa), không nằm trong mã trigger.
do $$
declare v_id uuid;
begin
  select id into v_id from vault.secrets where name = 'booking_webhook_secret';
  if v_id is null then
    perform vault.create_secret('DAN_WEBHOOK_SECRET_VAO_DAY', 'booking_webhook_secret', 'Header x-webhook-secret cho notify-booking');
  else
    perform vault.update_secret(v_id, 'DAN_WEBHOOK_SECRET_VAO_DAY');
  end if;
end $$;

create or replace function public.notify_booking_webhook()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare v_secret text;
begin
  select decrypted_secret into v_secret from vault.decrypted_secrets where name = 'booking_webhook_secret';
  perform net.http_post(
    url := 'https://yxcuzeielhdmsqlydiak.supabase.co/functions/v1/notify-booking',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-webhook-secret', coalesce(v_secret, '')),
    body := jsonb_build_object('type', 'INSERT', 'table', 'bookings', 'record', to_jsonb(new)),
    timeout_milliseconds := 5000
  );
  return new;
exception when others then
  -- Lỗi gửi thông báo không được làm hỏng việc đặt lịch của khách
  raise warning 'notify_booking_webhook: %', sqlerrm;
  return new;
end;
$$;

revoke execute on function public.notify_booking_webhook() from public, anon, authenticated;

drop trigger if exists notify_booking_webhook on public.bookings;
create trigger notify_booking_webhook
  after insert on public.bookings
  for each row execute function public.notify_booking_webhook();
