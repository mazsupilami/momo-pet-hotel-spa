// Cấu hình kết nối Supabase.
// Lấy 2 giá trị này ở Supabase Dashboard > Project Settings > API.
// Khóa "publishable" (anon) là khóa công khai, được phép đặt trong code frontend
// vì dữ liệu được bảo vệ bằng Row Level Security.
// KHÔNG BAO GIỜ đặt mật khẩu database hay khóa "secret" / "service_role" vào đây.
window.APP_CONFIG = {
  SUPABASE_URL: "https://yxcuzeielhdmsqlydiak.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_8wT0tEfiHwHn0l6fefXL5g_QhGhw290",
  // Tên (slug) của Edge Function chatbot AI, xem ở Supabase > Edge Functions (cột URL).
  CHAT_FUNCTION: "bright-service",
  // Cloudflare Turnstile chống spam (khóa site là khóa công khai). Để trống thì không hiện captcha.
  // Chỉ bật CAPTCHA trong Supabase (Authentication > Attack Protection) SAU KHI đã điền khóa này.
  TURNSTILE_SITE_KEY: "",
  // Tọa độ tiệm để tính phí đưa đón (177 Tôn Thất Thuyết, Khánh Hội).
  STORE_LAT: 10.7545,
  STORE_LON: 106.7075
};
