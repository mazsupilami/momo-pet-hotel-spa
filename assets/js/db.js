// Lớp truy cập dữ liệu. Mọi truy vấn Supabase đi qua đối tượng DB. Xem DATABASE.md.
(function () {
  const cfg = window.APP_CONFIG || {};
  const configured =
    /^https:\/\/.+/.test(cfg.SUPABASE_URL || "") &&
    (cfg.SUPABASE_ANON_KEY || "").length > 20 &&
    typeof window.supabase !== "undefined";

  const sb = configured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
  let servicesCache = null;
  let servicesSource = null;

  const NOT_READY = "Chưa kết nối được cơ sở dữ liệu Supabase nên chưa thể lưu. Xem DATABASE.md mục 4.";

  function requireDb() {
    if (!sb) throw new Error(NOT_READY);
  }

  // Đổi thông báo lỗi đăng nhập của Supabase sang tiếng Việt.
  function authError(error) {
    const m = (error && error.message) || "";
    if (/invalid login credentials/i.test(m)) return new Error("Email hoặc mật khẩu không đúng.");
    if (/already (registered|been registered)|already exists/i.test(m)) return new Error("Email này đã có tài khoản. Hãy đăng nhập.");
    if (/email not confirmed/i.test(m)) return new Error("Email chưa được xác nhận. Hãy mở email xác nhận rồi đăng nhập lại.");
    if (/password should be at least|weak password/i.test(m)) return new Error("Mật khẩu cần ít nhất 6 ký tự.");
    if (/invalid.*email|unable to validate email/i.test(m)) return new Error("Email không hợp lệ.");
    if (/should be different from the old password/i.test(m)) return new Error("Mật khẩu mới phải khác mật khẩu cũ.");
    if (/signups not allowed|signup.*disabled/i.test(m)) return new Error("Hiện chưa mở đăng ký tài khoản mới.");
    if (/email.*(rate|security purposes)|for security purposes/i.test(m)) return new Error("Bạn vừa yêu cầu gửi email. Vui lòng đợi ít phút rồi thử lại.");
    if (/rate limit/i.test(m)) return new Error("Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút.");
    if (/captcha/i.test(m)) return new Error('Xác minh "Tôi không phải robot" chưa hợp lệ hoặc đã hết hạn. Vui lòng tích lại ô xác minh rồi thử lại.');
    if (/anonymous sign-ins are disabled/i.test(m)) return new Error("Không tạo được phiên khách. Hãy bật Anonymous sign-ins trong Supabase.");
    return new Error(m || "Có lỗi khi xác thực tài khoản.");
  }

  // Đọc CSV có hỗ trợ ô nằm trong dấu ngoặc kép.
  function parseCSV(text) {
    const rows = [];
    let row = [], cell = "", quoted = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (quoted) {
        if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (c === '"') quoted = false;
        else cell += c;
      } else if (c === '"') quoted = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
      else if (c !== "\r") cell += c;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    const header = rows.shift();
    return rows
      .filter((r) => r.length === header.length)
      .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
  }

  async function loadServicesFromCSV() {
    const res = await fetch("data/services.csv");
    if (!res.ok) throw new Error("Không tải được danh sách dịch vụ.");
    return parseCSV(await res.text()).map((s) => ({
      ...s,
      id: Number(s.id),
      price: Number(s.price),
      is_featured: s.is_featured === "true",
    }));
  }

  async function currentUser() {
    if (!sb) return null;
    const { data } = await sb.auth.getSession();
    return data.session ? data.session.user : null;
  }

  // Có phiên đăng nhập rồi thì dùng, chưa có thì tạo phiên khách ẩn danh để RLS biết dữ liệu thuộc về ai.
  // captchaToken: mã Cloudflare Turnstile (bắt buộc khi Supabase bật Attack Protection > CAPTCHA).
  async function ensureUser(captchaToken) {
    requireDb();
    const user = await currentUser();
    if (user) return user;
    const { data, error } = await sb.auth.signInAnonymously(captchaToken ? { options: { captchaToken } } : undefined);
    if (error) throw authError(error);
    return data.user;
  }

  // Thu nhỏ ảnh bằng canvas, xuất JPEG.
  function shrinkImage(file, max) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob((b) => (b ? resolve(b) : reject(new Error("Không đọc được ảnh."))), "image/jpeg", 0.85);
      };
      img.onerror = () => reject(new Error("Không đọc được ảnh."));
      img.src = url;
    });
  }

  // Chưa chạy supabase/stay_dates.sql (chưa có cột end_date, diet, medication):
  // gửi lại không có các cột mới và ghi thông tin vào ghi chú để không mất lịch của khách.
  const STAY_COLS = ["end_date", "diet", "medication"];
  const missingStayCol = (error) => error && /end_date|diet|medication/.test(error.message || "") && /column|schema/i.test(error.message || "");
  function withoutStayCols(row) {
    const copy = { ...row };
    const extra = [];
    if (copy.end_date) extra.push(`Đến ngày ${copy.end_date}`);
    if (copy.diet) extra.push(`Ăn: ${copy.diet}`);
    if (copy.medication) extra.push(`Thuốc: ${copy.medication}`);
    STAY_COLS.forEach((c) => delete copy[c]);
    if (extra.length) copy.note = [copy.note, ...extra].filter(Boolean).join(" | ").slice(0, 300);
    return copy;
  }

  const DB = {
    isConfigured: () => Boolean(sb),
    servicesSource: () => servicesSource,

    // ================= TÀI KHOẢN =================

    // Trả về { user, loggedIn, email } — loggedIn = có tài khoản email (không phải khách ẩn danh).
    async getAuth() {
      const user = await currentUser();
      const loggedIn = Boolean(user && !user.is_anonymous && user.email);
      return { user, loggedIn, email: loggedIn ? user.email : null };
    },

    onAuthChange(callback) {
      if (sb) sb.auth.onAuthStateChange(() => callback());
    },

    // Đăng ký. Nếu khách đang có phiên ẩn danh (đã đặt lịch), nâng cấp chính phiên đó thành tài khoản
    // để giữ nguyên các lịch hẹn cũ.
    async signUp({ email, password, full_name, phone, captchaToken }) {
      requireDb();
      const user = await currentUser();
      if (user && user.is_anonymous) {
        let r = await sb.auth.updateUser({ email });
        if (r.error) throw authError(r.error);
        r = await sb.auth.updateUser({ password });
        if (r.error) {
          throw new Error("Đã ghi nhận email. Hãy mở email xác nhận của Supabase, sau đó đăng nhập để đặt mật khẩu.");
        }
      } else {
        const { data, error } = await sb.auth.signUp({ email, password, options: captchaToken ? { captchaToken } : {} });
        if (error) throw authError(error);
        if (!data.session) throw new Error("Đăng ký thành công. Hãy mở email xác nhận rồi đăng nhập.");
      }
      await DB.saveProfile({ full_name, phone });
    },

    async signIn(email, password, captchaToken) {
      requireDb();
      const { error } = await sb.auth.signInWithPassword({ email, password, options: captchaToken ? { captchaToken } : {} });
      if (error) throw authError(error);
    },

    async signOut() {
      if (sb) await sb.auth.signOut();
    },

    // Gửi email chứa liên kết đặt lại mật khẩu. Liên kết mở reset-password.html.
    async sendPasswordReset(email, captchaToken) {
      requireDb();
      const redirectTo = new URL("reset-password.html", location.href).href;
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo, captchaToken });
      if (error) throw authError(error);
    },

    async changePassword(password) {
      requireDb();
      const { error } = await sb.auth.updateUser({ password });
      if (error) throw authError(error);
    },

    // SELECT profiles
    async getProfile() {
      const user = await currentUser();
      if (!user) return null;
      const { data, error } = await sb.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle();
      if (error) throw new Error("Không tải được hồ sơ: " + error.message);
      return data;
    },

    // INSERT hoặc UPDATE profiles
    async saveProfile({ full_name, phone }) {
      const user = await ensureUser();
      const { error } = await sb
        .from("profiles")
        .upsert({ id: user.id, full_name: full_name || null, phone: phone || null, updated_at: new Date().toISOString() });
      if (error) throw new Error("Không lưu được hồ sơ: " + error.message);
    },

    async isAdmin() {
      if (!sb || !(await currentUser())) return false;
      const { data, error } = await sb.rpc("is_admin");
      return !error && data === true;
    },

    // ================= DỊCH VỤ =================

    // SELECT services (dự phòng: data/services.csv)
    async getServices(force = false) {
      if (servicesCache && !force) return servicesCache;
      if (sb) {
        const { data, error } = await sb.from("services").select("*").order("id");
        if (!error && data && data.length) {
          servicesCache = data;
          servicesSource = "supabase";
          return data;
        }
        console.warn("Không đọc được bảng services từ Supabase, dùng CSV dự phòng.", error);
      }
      servicesCache = await loadServicesFromCSV();
      servicesSource = "csv";
      return servicesCache;
    },

    async getService(id) {
      const all = await DB.getServices();
      return all.find((s) => s.id === Number(id)) || null;
    },

    // ================= LỊCH HẸN CỦA KHÁCH =================

    // INSERT bookings
    // Đã có phiên (khách ẩn danh hoặc tài khoản) thì không cần captcha.
    async hasSession() {
      return Boolean(await currentUser());
    },

    async createBooking(booking, captchaToken) {
      await ensureUser(captchaToken);
      let { data, error } = await sb.from("bookings").insert(booking).select().single();
      if (missingStayCol(error)) ({ data, error } = await sb.from("bookings").insert(withoutStayCols(booking)).select().single());
      if (error) throw new Error("Không đặt được lịch: " + error.message);
      return data;
    },

    // SELECT bookings của người đang dùng
    async getMyBookings() {
      const user = await currentUser();
      if (!user) return [];
      const { data, error } = await sb
        .from("bookings")
        .select("*, services(id, name, category, price, unit, image_url)")
        .eq("user_id", user.id)
        .order("booking_date")
        .order("booking_time");
      if (error) throw new Error("Không tải được lịch hẹn: " + error.message);
      return data;
    },

    // Số lịch sắp tới còn hiệu lực (chờ xác nhận / đã xác nhận, chưa qua ngày) cho huy hiệu ở menu
    async countMyBookings() {
      const user = await currentUser();
      if (!user) return 0;
      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      let { count, error } = await sb
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .in("status", ["pending", "confirmed"])
        .or(`booking_date.gte.${today},end_date.gte.${today}`);
      if (error) ({ count, error } = await sb.from("bookings").select("id", { count: "exact", head: true }).eq("user_id", user.id).in("status", ["pending", "confirmed"]).gte("booking_date", today));
      return error ? 0 : count || 0;
    },

    // UPDATE bookings
    async updateBooking(id, changes) {
      await ensureUser();
      const run = (row) => sb.from("bookings").update({ ...row, updated_at: new Date().toISOString() }).eq("id", id).select().single();
      let { data, error } = await run(changes);
      if (missingStayCol(error)) ({ data, error } = await run(withoutStayCols(changes)));
      if (error) throw new Error("Không cập nhật được lịch: " + error.message);
      return data;
    },

    // DELETE bookings
    async deleteBooking(id) {
      await ensureUser();
      const { error } = await sb.from("bookings").delete().eq("id", id);
      if (error) throw new Error("Không hủy được lịch: " + error.message);
    },

    // ================= ĐÁNH GIÁ =================

    async getReviews(serviceId) {
      if (!sb) return [];
      const q = (cols) => sb.from("reviews").select(cols).eq("service_id", serviceId).order("created_at", { ascending: false });
      let { data, error } = await q("id, author_name, rating, comment, created_at, booking_id, photo_url");
      // Chưa chạy supabase/features_v2.sql (chưa có cột mới) thì đọc các cột cũ
      if (error && /column/i.test(error.message)) ({ data, error } = await q("id, author_name, rating, comment, created_at"));
      if (error) throw new Error("Không tải được đánh giá: " + error.message);
      return data;
    },

    // Lịch hẹn đã hoàn thành của tài khoản đang đăng nhập mà chưa đánh giá (lọc theo gói nếu có serviceId).
    async getReviewableBookings(serviceId) {
      const auth = await DB.getAuth();
      if (!auth.loggedIn) return [];
      let q = sb
        .from("bookings")
        .select("id, service_id, pet_name, booking_date")
        .eq("user_id", auth.user.id)
        .eq("status", "done")
        .order("booking_date", { ascending: false });
      if (serviceId) q = q.eq("service_id", serviceId);
      const { data, error } = await q;
      if (error || !data.length) return [];
      const { data: done } = await sb.from("reviews").select("booking_id").in("booking_id", data.map((b) => b.id));
      const reviewed = new Set((done || []).map((r) => r.booking_id));
      return data.filter((b) => !reviewed.has(b.id));
    },

    // Tải ảnh bé lên Storage (bucket review-photos/<user_id>/...). Ảnh được thu nhỏ còn tối đa 1200px.
    async uploadReviewPhoto(file) {
      const auth = await DB.getAuth();
      if (!auth.loggedIn) throw new Error("Cần đăng nhập để tải ảnh.");
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("Chỉ nhận ảnh JPG, PNG hoặc WebP.");
      const blob = await shrinkImage(file, 1200);
      if (blob.size > 2 * 1024 * 1024) throw new Error("Ảnh quá lớn (tối đa 2 MB).");
      const path = `${auth.user.id}/${Date.now()}.jpg`;
      const { error } = await sb.storage.from("review-photos").upload(path, blob, { contentType: "image/jpeg", upsert: false });
      if (error) throw new Error("Không tải được ảnh: " + error.message);
      return sb.storage.from("review-photos").getPublicUrl(path).data.publicUrl;
    },

    // INSERT reviews (database chỉ nhận khi booking_id là lịch đã hoàn thành của chính khách)
    async addReview(review) {
      const auth = await DB.getAuth();
      if (!auth.loggedIn) throw new Error("Cần đăng nhập để đánh giá.");
      const { error } = await sb.from("reviews").insert(review);
      if (error) {
        if (/duplicate|unique/i.test(error.message)) throw new Error("Lịch hẹn này đã được đánh giá.");
        if (/row-level security/i.test(error.message)) throw new Error("Chỉ khách đã hoàn thành dịch vụ mới được đánh giá.");
        throw new Error("Không gửi được đánh giá: " + error.message);
      }
    },

    // ================= QUẢN TRỊ =================

    async adminGetBookings() {
      requireDb();
      const { data, error } = await sb
        .from("bookings")
        .select("*, services(id, name, price, unit)")
        .order("booking_date", { ascending: false })
        .order("booking_time", { ascending: false });
      if (error) throw new Error("Không tải được lịch hẹn: " + error.message);
      return data;
    },

    // INSERT bookings do admin tạo hộ khách gọi điện (có thể đặt sẵn trạng thái)
    async adminCreateBooking(booking) {
      requireDb();
      let { data, error } = await sb.from("bookings").insert(booking).select("*, services(id, name, price, unit)").single();
      if (missingStayCol(error)) ({ data, error } = await sb.from("bookings").insert(withoutStayCols(booking)).select("*, services(id, name, price, unit)").single());
      if (error) throw new Error("Không tạo được lịch hẹn: " + error.message);
      return data;
    },

    // UPDATE bookings.status (chỉ admin)
    async adminSetStatus(id, status) {
      requireDb();
      const { data, error } = await sb.from("bookings").update({ status, updated_at: new Date().toISOString() }).eq("id", id).select("id");
      if (error) throw new Error("Không đổi được trạng thái: " + error.message);
      if (!data.length) throw new Error("Không có quyền đổi lịch hẹn này.");
    },

    // UPDATE thông tin lịch hẹn (chỉ admin): ngày giờ, khách, thú cưng, ghi chú
    async adminUpdateBooking(id, changes) {
      requireDb();
      const run = (row) =>
        sb.from("bookings").update({ ...row, updated_at: new Date().toISOString() }).eq("id", id).select("*, services(id, name, price, unit)");
      let { data, error } = await run(changes);
      if (missingStayCol(error)) ({ data, error } = await run(withoutStayCols(changes)));
      if (error) throw new Error("Không lưu được lịch hẹn: " + error.message);
      if (!data.length) throw new Error("Không có quyền sửa lịch hẹn này.");
      return data[0];
    },

    // Danh sách tài khoản khách (hàm admin_list_customers trong supabase/qa_fixes.sql)
    async adminListCustomers() {
      requireDb();
      const { data, error } = await sb.rpc("admin_list_customers");
      if (error) {
        if (/function|does not exist|schema cache/i.test(error.message)) throw new Error("Chưa cài danh sách khách hàng. Hãy chạy supabase/qa_fixes.sql.");
        throw new Error("Không tải được khách hàng: " + error.message);
      }
      return data;
    },

    async adminUpdateProfile(id, { full_name, phone }) {
      requireDb();
      const { data, error } = await sb
        .from("profiles")
        .upsert({ id, full_name: full_name || null, phone: phone || null, updated_at: new Date().toISOString() })
        .select("id");
      if (error) throw new Error("Không lưu được hồ sơ khách: " + error.message);
      if (!data.length) throw new Error("Không có quyền sửa hồ sơ này.");
    },

    // DELETE bookings (chỉ admin)
    async adminDeleteBooking(id) {
      requireDb();
      const { data, error } = await sb.from("bookings").delete().eq("id", id).select("id");
      if (error) throw new Error("Không xóa được lịch hẹn: " + error.message);
      if (!data.length) throw new Error("Không có quyền xóa lịch hẹn này.");
    },

    // UPDATE services (chỉ admin)
    async adminUpdateService(id, changes) {
      requireDb();
      const { data, error } = await sb.from("services").update(changes).eq("id", id).select("id");
      if (error) throw new Error("Không lưu được dịch vụ: " + error.message);
      if (!data.length) throw new Error("Không có quyền sửa dịch vụ.");
      servicesCache = null;
    },

    async adminGetReviews() {
      requireDb();
      const q = (cols) => sb.from("reviews").select(cols).order("created_at", { ascending: false });
      let { data, error } = await q("id, author_name, rating, comment, created_at, booking_id, photo_url, services(name)");
      if (error && /column/i.test(error.message)) ({ data, error } = await q("id, author_name, rating, comment, created_at, services(name)"));
      if (error) throw new Error("Không tải được đánh giá: " + error.message);
      return data;
    },

    // Realtime: gọi callback mỗi khi bảng bookings có thay đổi (RLS: admin thấy mọi lịch).
    subscribeBookings(callback) {
      if (!sb) return () => {};
      const ch = sb
        .channel("admin-bookings")
        .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, (payload) => callback(payload))
        .subscribe();
      return () => sb.removeChannel(ch);
    },

    // DELETE reviews (chỉ admin)
    async adminDeleteReview(id) {
      requireDb();
      const { data, error } = await sb.from("reviews").delete().eq("id", id).select("id");
      if (error) throw new Error("Không xóa được đánh giá: " + error.message);
      if (!data.length) throw new Error("Không có quyền xóa đánh giá này.");
    },
  };

  window.DB = DB;
})();
