// Cấu hình kết nối Supabase.
// Lấy 2 giá trị này ở Supabase Dashboard > Project Settings > API.
// Khóa "publishable" (anon) là khóa công khai, được phép đặt trong code frontend
// vì dữ liệu được bảo vệ bằng Row Level Security.
// KHÔNG BAO GIỜ đặt mật khẩu database hay khóa "secret" / "service_role" vào đây.
window.APP_CONFIG = {
  SUPABASE_URL: "https://yxcuzeielhdmsqlydiak.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_8wT0tEfiHwHn0l6fefXL5g_QhGhw290"
};
