// Supabase Edge Function "notify-booking": báo lịch hẹn mới vào Telegram của tiệm.
//
// Được gọi bởi Database Webhook (Supabase > Database > Webhooks) khi bảng bookings có dòng mới (INSERT).
// Secrets cần đặt trong Supabase > Edge Functions > Secrets (không ghi vào code):
//   TELEGRAM_BOT_TOKEN  mã bot lấy từ @BotFather
//   TELEGRAM_CHAT_ID    id cuộc trò chuyện nhận tin (xem hướng dẫn trong DATABASE.md)
//   WEBHOOK_SECRET      chuỗi bí mật tự đặt; webhook gửi kèm header "x-webhook-secret" có cùng giá trị
// Khi deploy: TẮT "Verify JWT" (webhook xác thực bằng WEBHOOK_SECRET).

type Booking = {
  id: number;
  service_id: number;
  owner_name: string;
  phone: string;
  pet_name: string;
  pet_type: string;
  pet_weight: number;
  booking_date: string;
  booking_time: string;
  note: string | null;
  status?: string;
  end_date?: string | null;
  diet?: string | null;
  medication?: string | null;
};

const SITE = "https://mazsupilami.github.io/momo-pet-hotel-spa";

// Telegram HTML mode: chỉ cần escape 3 ký tự
const esc = (v: unknown) => String(v ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));

async function serviceName(id: number): Promise<string> {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !key) return `Dịch vụ #${id}`;
  const res = await fetch(`${url}/rest/v1/services?select=name&id=eq.${Number(id)}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const rows = res.ok ? await res.json() : [];
  return rows[0]?.name ?? `Dịch vụ #${id}`;
}

Deno.serve(async (req) => {
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

  if (req.method !== "POST") return json({ error: "method" }, 405);
  const secret = Deno.env.get("WEBHOOK_SECRET");
  if (!secret || req.headers.get("x-webhook-secret") !== secret) return json({ error: "forbidden" }, 403);

  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return json({ error: "not_configured" }, 503);

  let payload: { type?: string; table?: string; record?: Booking };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  if (payload.type !== "INSERT" || payload.table !== "bookings" || !payload.record) return json({ skipped: true });

  const b = payload.record;
  const vn = (iso: string) => {
    const [y, m, d] = String(iso).split("-");
    return `${d}/${m}/${y}`;
  };
  const days = b.end_date ? Math.round((Date.parse(b.end_date) - Date.parse(b.booking_date)) / 86400000) : 0;
  const text = [
    "🐾 <b>Lịch hẹn mới</b>",
    `<b>${esc(await serviceName(b.service_id))}</b>`,
    b.end_date
      ? `📅 ${esc(vn(b.booking_date))} → ${esc(vn(b.end_date))} (${days} đêm / ${days + 1} ngày) · nhận bé ${esc(String(b.booking_time).slice(0, 5))}`
      : `📅 ${esc(String(b.booking_time).slice(0, 5))} · ${esc(vn(b.booking_date))}`,
    `🐶 Bé ${esc(b.pet_name)} (${esc(b.pet_type)}, ${esc(b.pet_weight)} kg)`,
    `👤 ${esc(b.owner_name)} · 📞 ${esc(b.phone)}`,
    b.diet ? `🍽 ${esc(b.diet)}` : "",
    b.medication ? `💊 ${esc(b.medication)}` : "",
    b.note ? `📝 ${esc(b.note)}` : "",
    b.status && b.status !== "pending" ? `Trạng thái: ${esc(b.status)} (admin tạo)` : "⏳ Chờ xác nhận, nhắn Zalo cho khách trong 30 phút",
  ].filter(Boolean).join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: [[{ text: "Mở trang Quản trị", url: `${SITE}/admin.html` }]] },
    }),
  });
  if (!res.ok) {
    console.error("telegram", res.status, (await res.text()).slice(0, 300));
    return json({ error: "telegram" }, 502);
  }
  return json({ ok: true });
});
